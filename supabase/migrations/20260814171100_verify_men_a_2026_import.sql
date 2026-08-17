-- Pārbaudes vīriešu A grupas 2026. gada importam.
do $$
declare
  v_tournament_id constant uuid := 'f335dc4b-3831-48d7-a282-fcea7877edfa';
  v_group_id constant uuid := 'a4a4cfb2-e22c-419c-9b94-6a89311cd327';
  v_roberts_id uuid;
  item jsonb;
  v_player_id uuid;
  v_actual_points integer;
  expected_points constant jsonb := $data$[{"name":"Severins Goihmans","sourcePoints":15,"points":15},{"name":"Milutin Milosevic","sourcePoints":3,"points":3},{"name":"Viktors Pliska","sourcePoints":10,"points":10},{"name":"Raimonds Daugulis","sourcePoints":6,"points":6},{"name":"Edgars Zālītis","sourcePoints":11,"points":11},{"name":"Viktors Jaroščuks","sourcePoints":7,"points":7},{"name":"Linards Anisimovs","sourcePoints":12,"points":12},{"name":"Ernests Sinkevičs","sourcePoints":7,"points":7},{"name":"Igors Suharevskis","sourcePoints":13,"points":13},{"name":"Jānis Bērtiņš","sourcePoints":21,"points":21},{"name":"Viktors Josifovs","sourcePoints":0,"points":0},{"name":"Jevgēnijs Demičevs","sourcePoints":1,"points":1},{"name":"Toms Vizulis","sourcePoints":2,"points":2},{"name":"Valdis Ulmanis","sourcePoints":4,"points":4},{"name":"Elvijs Maurītis","sourcePoints":14,"points":14},{"name":"Gints Ratnieks","sourcePoints":6,"points":6}]$data$::jsonb;
begin
  select id into v_roberts_id
  from public.players
  where lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) = lower('Roberts Pļāvējs')
  order by is_admin desc, created_at asc
  limit 1;

  if (select count(*) from public.group_players
      where group_id = v_group_id and status = 'active') <> 16 then
    raise exception 'A_VĪRIEŠI: nav 16 aktīvu spēlētāju.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id) <> 120 then
    raise exception 'A_VĪRIEŠI: nav 120 spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'completed') <> 33 then
    raise exception 'A_VĪRIEŠI: nav 33 pabeigtu spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'unscheduled') <> 87 then
    raise exception 'A_VĪRIEŠI: nav 87 neizspēlētu spēļu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id) <> 71 then
    raise exception 'A_VĪRIEŠI: nav 71 setu ierakstu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id
        and match_set.set_type = 'match_tiebreak') <> 5 then
    raise exception 'A_VĪRIEŠI: nav 5 supertaibreiku.';
  end if;

  if (select count(*) from (
        select least(player_one_id::text, player_two_id::text), greatest(player_one_id::text, player_two_id::text)
        from public.matches where tournament_id = v_tournament_id
        group by 1, 2 having count(*) > 1
      ) duplicate_pairs) <> 0 then
    raise exception 'A_VĪRIEŠI: atrasti dublēti spēlētāju pāri.';
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
    raise exception 'A_VĪRIEŠI: spēles statuss neatbilst rezultāta datiem.';
  end if;

  if exists (
    select 1 from public.matches
    where tournament_id = v_tournament_id and scheduled_at is not null and (
      scheduled_at < timestamptz '2026-06-01 00:00:00+03'
      or scheduled_at >= timestamptz '2026-08-11 00:00:00+03'
    )
  ) then
    raise exception 'A_VĪRIEŠI: spēles datums ir ārpus 2026-06-01–2026-08-10 intervāla.';
  end if;

  if v_roberts_id is not null and exists (
    select 1 from public.group_players
    where group_id = v_group_id and player_id = v_roberts_id and status = 'active'
  ) then
    raise exception 'A_VĪRIEŠI: Roberts Pļāvējs nedrīkst būt grupas dalībnieks.';
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
      raise exception 'A_VĪRIEŠI: % punktiem jābūt %, bet aprēķināti %.',
        item ->> 'name', item ->> 'points', v_actual_points;
    end if;
  end loop;
end
$$;
