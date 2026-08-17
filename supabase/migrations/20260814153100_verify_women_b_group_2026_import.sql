do $$
declare
  v_tournament_id constant uuid := '6e2ef086-95ce-4f51-957e-5542a4420f8f';
  v_group_id constant uuid := '5b673f72-05a2-4419-9293-7d5848fc12f2';
  v_roberts_id uuid;
begin
  select id into v_roberts_id
  from public.players
  where lower(trim(full_name)) = lower('Roberts Pļāvējs')
  order by is_admin desc, created_at asc
  limit 1;

  if (select count(*) from public.group_players
      where group_id = v_group_id and status = 'active') <> 21 then
    raise exception 'Sieviešu B grupas importā nav 21 aktīvas spēlētājas.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id) <> 210 then
    raise exception 'Sieviešu B grupas importā nav 210 spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'completed') <> 100 then
    raise exception 'Sieviešu B grupas importā nav 100 pabeigtu spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'unscheduled') <> 110 then
    raise exception 'Sieviešu B grupas importā nav 110 neizspēlētu spēļu.';
  end if;

  if (
    select count(*)
    from public.match_sets match_set
    join public.matches match on match.id = match_set.match_id
    where match.tournament_id = v_tournament_id
  ) <> 208 then
    raise exception 'Sieviešu B grupas importā nav 208 setu ierakstu.';
  end if;

  if (
    select count(*)
    from public.matches match
    join public.match_sets match_set on match_set.match_id = match.id
    where match.tournament_id = v_tournament_id
      and match_set.set_type = 'match_tiebreak'
  ) <> 8 then
    raise exception 'Sieviešu B grupas importā nav 8 supertaibreiku.';
  end if;

  if v_roberts_id is not null and exists (
    select 1
    from public.group_players
    where group_id = v_group_id and player_id = v_roberts_id and status = 'active'
  ) then
    raise exception 'Roberts Pļāvējs nedrīkst būt sieviešu B grupas dalībnieks.';
  end if;

  if exists (
    select 1
    from public.matches
    where tournament_id = v_tournament_id
      and scheduled_at is not null
      and (
        scheduled_at < timestamptz '2026-06-01 00:00:00+03'
        or scheduled_at >= timestamptz '2026-08-11 00:00:00+03'
      )
  ) then
    raise exception 'Importētās spēles datums ir ārpus 2026-06-01–2026-08-10 intervāla.';
  end if;
end
$$;
