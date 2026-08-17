do $$
declare
  v_tournament_id constant uuid := '2b3e4ee6-8886-4556-b4b1-de9f590f319e';
  v_group_id constant uuid := '4efd1425-6532-4173-8b39-6957a0eb87be';
  v_roberts_id uuid;
begin
  select id into v_roberts_id
  from public.players
  where lower(trim(full_name)) = lower('Roberts Pļāvējs')
  order by is_admin desc, created_at asc
  limit 1;

  if (select count(*) from public.group_players where group_id = v_group_id and status = 'active') <> 20 then
    raise exception 'B grupas importā nav 20 aktīvu spēlētāju.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id) <> 190 then
    raise exception 'B grupas importā nav 190 spēļu.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id and status = 'completed') <> 131 then
    raise exception 'B grupas importā nav 131 pabeigtas spēles.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id and status = 'unscheduled') <> 59 then
    raise exception 'B grupas importā nav 59 neizspēlētas spēles.';
  end if;

  if (
    select count(*)
    from public.match_sets match_set
    join public.matches match on match.id = match_set.match_id
    where match.tournament_id = v_tournament_id
  ) <> 287 then
    raise exception 'B grupas importā nav 287 setu ieraksti.';
  end if;

  if (
    select count(*)
    from public.matches
    where tournament_id = v_tournament_id
      and (player_one_id = v_roberts_id or player_two_id = v_roberts_id)
  ) <> 19 then
    raise exception 'Robertam Pļāvējam nav 19 B grupas spēles.';
  end if;
end
$$;
