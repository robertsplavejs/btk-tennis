-- Pārbaudes jauniešu 2026. gada importam.
do $$
declare
  v_tournament_id constant uuid := 'd3a6f3dc-1160-4880-bac2-6d86eb316fcd';
  v_group_id constant uuid := 'dfaccb5a-ebb0-4480-9a3b-6b0919506074';
  v_roberts_id uuid;
  item jsonb;
  v_player_id uuid;
  v_actual_points integer;
  expected_points constant jsonb := $data$[{"name":"Evelīna Nauduža","sourcePoints":10,"points":10},{"name":"Elza Tāle","sourcePoints":10,"points":10},{"name":"Keitija Košinska","sourcePoints":25,"points":25},{"name":"Alesandra Anisimova","sourcePoints":4,"points":4},{"name":"Alekss Kaupužs","sourcePoints":9,"points":9},{"name":"Elizabete Laicāne","sourcePoints":3,"points":3},{"name":"Astra Griezne","sourcePoints":3,"points":3},{"name":"Ralfs Mačuks","sourcePoints":0,"points":0},{"name":"Patriks Dudzinskis","sourcePoints":2,"points":2},{"name":"Eduards Dričs","sourcePoints":3,"points":3},{"name":"Adrians Čakans","sourcePoints":10,"points":11}]$data$::jsonb;
begin
  select id into v_roberts_id
  from public.players
  where lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) = lower('Roberts Pļāvējs')
  order by is_admin desc, created_at asc
  limit 1;

  if (select count(*) from public.group_players
      where group_id = v_group_id and status = 'active') <> 11 then
    raise exception 'JAUNIEŠI: nav 11 aktīvu spēlētāju.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id) <> 55 then
    raise exception 'JAUNIEŠI: nav 55 spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'completed') <> 20 then
    raise exception 'JAUNIEŠI: nav 20 pabeigtu spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'unscheduled') <> 35 then
    raise exception 'JAUNIEŠI: nav 35 neizspēlētu spēļu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id) <> 42 then
    raise exception 'JAUNIEŠI: nav 42 setu ierakstu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id
        and match_set.set_type = 'match_tiebreak') <> 2 then
    raise exception 'JAUNIEŠI: nav 2 supertaibreiku.';
  end if;

  if (select count(*) from (
        select least(player_one_id::text, player_two_id::text), greatest(player_one_id::text, player_two_id::text)
        from public.matches where tournament_id = v_tournament_id
        group by 1, 2 having count(*) > 1
      ) duplicate_pairs) <> 0 then
    raise exception 'JAUNIEŠI: atrasti dublēti spēlētāju pāri.';
  end if;

  if exists (
    select 1 from public.matches match
    where match.tournament_id = v_tournament_id and (
      (match.status = 'completed' and (match.winner_id is null or
        (select count(*) from public.match_sets where match_id = match.id) < 2))
      or
      (match.status = 'unscheduled' and (match.winner_id is not null or match.scheduled_at is not null or
        exists (select 1 from public.match_sets where match_id = match.id)))
    )
  ) then
    raise exception 'JAUNIEŠI: spēles statuss neatbilst rezultāta datiem.';
  end if;

  if exists (
    select 1 from public.matches
    where tournament_id = v_tournament_id and scheduled_at is not null and (
      scheduled_at < timestamptz '2026-06-01 00:00:00+03'
      or scheduled_at >= timestamptz '2026-08-11 00:00:00+03'
    )
  ) then
    raise exception 'JAUNIEŠI: spēles datums ir ārpus 2026-06-01–2026-08-10 intervāla.';
  end if;

  if v_roberts_id is not null and exists (
    select 1 from public.group_players
    where group_id = v_group_id and player_id = v_roberts_id and status = 'active'
  ) then
    raise exception 'JAUNIEŠI: Roberts Pļāvējs nedrīkst būt grupas dalībnieks.';
  end if;

  for item in select * from jsonb_array_elements(expected_points) loop
    select id into v_player_id from public.players
    where lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) =
      lower(regexp_replace(trim(item ->> 'name'), '\s+', ' ', 'g'))
    order by is_admin desc, created_at asc limit 1;

    select coalesce(sum(case when match.winner_id = v_player_id then 3 else 1 end), 0)::integer
    into v_actual_points
    from public.matches match
    where match.tournament_id = v_tournament_id
      and match.status = 'completed'
      and (match.player_one_id = v_player_id or match.player_two_id = v_player_id);

    if v_actual_points <> (item ->> 'points')::integer then
      raise exception 'JAUNIEŠI: % punktiem jābūt %, bet aprēķināti %.',
        item ->> 'name', item ->> 'points', v_actual_points;
    end if;
  end loop;
end
$$;
