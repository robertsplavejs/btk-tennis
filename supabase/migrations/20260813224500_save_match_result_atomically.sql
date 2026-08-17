create or replace function public.save_match_result(
  target_match_id uuid,
  submitted_sets jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  referenced_match public.matches%rowtype;
  set_count integer;
  set_index integer;
  submitted_set jsonb;
  set_kind text;
  player_one_score integer;
  player_two_score integer;
  player_one_wins integer := 0;
  player_two_wins integer := 0;
  first_set_player_one_won boolean;
  second_set_player_one_won boolean;
  calculated_winner_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into referenced_match
  from public.matches
  where id = target_match_id
  for update;

  if not found then
    raise exception 'Match not found';
  end if;

  if not coalesce((select public.is_admin()), false)
     and current_user_id <> referenced_match.player_one_id
     and current_user_id <> referenced_match.player_two_id then
    raise exception 'Only a match participant or administrator can save the result';
  end if;

  if referenced_match.status not in ('scheduled', 'completed') then
    raise exception 'Only a scheduled or completed match can receive a result';
  end if;

  if jsonb_typeof(submitted_sets) <> 'array' then
    raise exception 'Sets must be an array';
  end if;

  set_count := jsonb_array_length(submitted_sets);

  if set_count not in (2, 3) then
    raise exception 'A match result must contain two or three sets';
  end if;

  for set_index in 0..set_count - 1 loop
    submitted_set := submitted_sets -> set_index;
    set_kind := coalesce(submitted_set ->> 'set_type', 'regular');

    begin
      player_one_score := (submitted_set ->> 'player_one_score')::integer;
      player_two_score := (submitted_set ->> 'player_two_score')::integer;
    exception when others then
      raise exception 'Set % contains an invalid score', set_index + 1;
    end;

    if set_kind not in ('regular', 'match_tiebreak') then
      raise exception 'Set % contains an unsupported type', set_index + 1;
    end if;

    if set_index < 2 and set_kind <> 'regular' then
      raise exception 'The first two sets must be regular sets';
    end if;

    if player_one_score < 0
       or player_two_score < 0
       or player_one_score = player_two_score then
      raise exception 'Set % contains an invalid score', set_index + 1;
    end if;

    if set_kind = 'match_tiebreak' then
      if greatest(player_one_score, player_two_score) < 10
         or abs(player_one_score - player_two_score) < 2 then
        raise exception 'Set % is not a valid match tiebreak', set_index + 1;
      end if;
    elsif not (
      (greatest(player_one_score, player_two_score) = 6
       and least(player_one_score, player_two_score) <= 4)
      or
      (greatest(player_one_score, player_two_score) = 7
       and least(player_one_score, player_two_score) in (5, 6))
    ) then
      raise exception 'Set % is not a valid regular set', set_index + 1;
    end if;

    if player_one_score > player_two_score then
      player_one_wins := player_one_wins + 1;
    else
      player_two_wins := player_two_wins + 1;
    end if;

    if set_index = 0 then
      first_set_player_one_won := player_one_score > player_two_score;
    elsif set_index = 1 then
      second_set_player_one_won := player_one_score > player_two_score;
    end if;
  end loop;

  if first_set_player_one_won = second_set_player_one_won
     and set_count <> 2 then
    raise exception 'A third set is not allowed after a straight-sets win';
  end if;

  if first_set_player_one_won <> second_set_player_one_won
     and set_count <> 3 then
    raise exception 'A deciding set is required at one set all';
  end if;

  if player_one_wins = 2 then
    calculated_winner_id := referenced_match.player_one_id;
  elsif player_two_wins = 2 then
    calculated_winner_id := referenced_match.player_two_id;
  else
    raise exception 'The match winner cannot be determined';
  end if;

  delete from public.match_sets
  where match_id = target_match_id;

  for set_index in 0..set_count - 1 loop
    submitted_set := submitted_sets -> set_index;

    insert into public.match_sets (
      match_id,
      set_number,
      set_type,
      player_one_score,
      player_two_score,
      player_one_tiebreak_points,
      player_two_tiebreak_points
    ) values (
      target_match_id,
      set_index + 1,
      coalesce(submitted_set ->> 'set_type', 'regular'),
      (submitted_set ->> 'player_one_score')::integer,
      (submitted_set ->> 'player_two_score')::integer,
      nullif(submitted_set ->> 'player_one_tiebreak_points', '')::integer,
      nullif(submitted_set ->> 'player_two_tiebreak_points', '')::integer
    );
  end loop;

  update public.matches
  set winner_id = calculated_winner_id,
      result_entered_by = current_user_id,
      result_type = 'regular',
      status = 'completed',
      updated_at = now()
  where id = target_match_id;

  return calculated_winner_id;
end;
$$;

revoke all
on function public.save_match_result(uuid, jsonb)
from public;

grant execute
on function public.save_match_result(uuid, jsonb)
to authenticated;

comment on function public.save_match_result(uuid, jsonb) is
'Validates and replaces match sets, calculates the winner and completes the match in one transaction.';
