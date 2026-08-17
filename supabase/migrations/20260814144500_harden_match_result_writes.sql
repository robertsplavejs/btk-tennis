-- Results and set rows may only be written through validated database functions.
-- Participants retain direct access only to the scheduling transition.

revoke insert, update, delete
on table public.match_sets
from authenticated;

alter function public.save_match_result(uuid, jsonb)
rename to save_match_result_internal;

revoke all
on function public.save_match_result_internal(uuid, jsonb)
from public, authenticated;

create function public.save_match_result(
  target_match_id uuid,
  submitted_sets jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_winner_id uuid;
begin
  perform set_config('btk.validated_result_write', 'on', true);

  saved_winner_id := public.save_match_result_internal(
    target_match_id,
    submitted_sets
  );

  return saved_winner_id;
end;
$$;

revoke all
on function public.save_match_result(uuid, jsonb)
from public;

grant execute
on function public.save_match_result(uuid, jsonb)
to authenticated;

create or replace function public.save_match_walkover(
  target_match_id uuid,
  selected_winner_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  referenced_match public.matches%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not coalesce((select public.is_admin()), false) then
    raise exception 'Only an administrator can save a walkover';
  end if;

  select * into referenced_match
  from public.matches
  where id = target_match_id
  for update;

  if not found then
    raise exception 'Match not found';
  end if;

  if selected_winner_id <> referenced_match.player_one_id
     and selected_winner_id <> referenced_match.player_two_id then
    raise exception 'The winner must be a match participant';
  end if;

  perform set_config('btk.validated_result_write', 'on', true);

  delete from public.match_sets
  where match_id = target_match_id;

  update public.matches
  set winner_id = selected_winner_id,
      result_entered_by = current_user_id,
      result_type = 'walkover',
      status = 'completed',
      updated_at = now()
  where id = target_match_id;

  return selected_winner_id;
end;
$$;

revoke all
on function public.save_match_walkover(uuid, uuid)
from public;

grant execute
on function public.save_match_walkover(uuid, uuid)
to authenticated;

create or replace function public.protect_match_identity_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.tournament_id is distinct from old.tournament_id
    or new.group_id is distinct from old.group_id
    or new.player_one_id is distinct from old.player_one_id
    or new.player_two_id is distinct from old.player_two_id
    or new.round_number is distinct from old.round_number
    or new.match_number is distinct from old.match_number then
    raise exception 'Spēles dalībniekus un turnīra sasaisti drīkst mainīt tikai administrators.';
  end if;

  if current_setting('btk.validated_result_write', true) = 'on' then
    return new;
  end if;

  if new.winner_id is distinct from old.winner_id
    or new.result_entered_by is distinct from old.result_entered_by
    or new.result_type is distinct from old.result_type then
    raise exception 'Spēles rezultātu drīkst mainīt tikai ar validēto rezultāta saglabāšanas darbību.';
  end if;

  if old.status in ('completed', 'cancelled') then
    raise exception 'Pabeigtas vai atceltas spēles datus dalībnieks vairs nevar mainīt.';
  end if;

  if new.status is distinct from old.status
     and new.status <> 'scheduled' then
    raise exception 'Spēles dalībnieks drīkst mainīt statusu tikai uz ieplānotu.';
  end if;

  return new;
end;
$$;

revoke all
on function public.protect_match_identity_fields()
from public;

comment on function public.save_match_walkover(uuid, uuid) is
'Atomically clears sets and saves an administrator-authorized walkover.';

comment on function public.protect_match_identity_fields() is
'Prevents direct API writes to match identity and result fields while allowing validated result functions and participant scheduling.';
