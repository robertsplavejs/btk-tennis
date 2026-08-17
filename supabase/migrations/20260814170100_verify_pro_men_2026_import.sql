-- Pārbaudes PRO vīriešu 2026. gada importam.
do $$
declare
  v_tournament_id constant uuid := 'aac22ac1-7d16-439c-adf6-143916ac3504';
  v_group_id constant uuid := '446481e6-6db8-405e-b1be-af7d79720ac2';
  v_roberts_id uuid;
  item jsonb;
  v_player_id uuid;
  v_actual_points integer;
  expected_points constant jsonb := $data$[{"name":"Edijs Kriķis","sourcePoints":12,"points":12},{"name":"Kalvis Ķiesneris","sourcePoints":5,"points":5},{"name":"Rinalds Rozenfelds","sourcePoints":8,"points":8},{"name":"Roberts Gandzjuks","sourcePoints":6,"points":6},{"name":"Kārlis Leja","sourcePoints":1,"points":1},{"name":"Ainārs Juškēvičs","sourcePoints":3,"points":3},{"name":"Jānis Kļaviņš","sourcePoints":15,"points":15},{"name":"Antons Naumenko","sourcePoints":0,"points":0},{"name":"Armands Stokmanis","sourcePoints":0,"points":0},{"name":"Artis Inda","sourcePoints":10,"points":10},{"name":"Gatis Dejus","sourcePoints":8,"points":8}]$data$::jsonb;
begin
  select id into v_roberts_id
  from public.players
  where lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) = lower('Roberts Pļāvējs')
  order by is_admin desc, created_at asc
  limit 1;

  if (select count(*) from public.group_players
      where group_id = v_group_id and status = 'active') <> 11 then
    raise exception 'PRO_VĪRIEŠI: nav 11 aktīvu spēlētāju.';
  end if;

  if (select count(*) from public.matches where tournament_id = v_tournament_id) <> 55 then
    raise exception 'PRO_VĪRIEŠI: nav 55 spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'completed') <> 17 then
    raise exception 'PRO_VĪRIEŠI: nav 17 pabeigtu spēļu.';
  end if;

  if (select count(*) from public.matches
      where tournament_id = v_tournament_id and status = 'unscheduled') <> 38 then
    raise exception 'PRO_VĪRIEŠI: nav 38 neizspēlētu spēļu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id) <> 38 then
    raise exception 'PRO_VĪRIEŠI: nav 38 setu ierakstu.';
  end if;

  if (select count(*) from public.match_sets match_set
      join public.matches match on match.id = match_set.match_id
      where match.tournament_id = v_tournament_id
        and match_set.set_type = 'match_tiebreak') <> 2 then
    raise exception 'PRO_VĪRIEŠI: nav 2 supertaibreiku.';
  end if;

  if (select count(*) from (
        select least(player_one_id::text, player_two_id::text), greatest(player_one_id::text, player_two_id::text)
        from public.matches where tournament_id = v_tournament_id
        group by 1, 2 having count(*) > 1
      ) duplicate_pairs) <> 0 then
    raise exception 'PRO_VĪRIEŠI: atrasti dublēti spēlētāju pāri.';
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
    raise exception 'PRO_VĪRIEŠI: spēles statuss neatbilst rezultāta datiem.';
  end if;

  if exists (
    select 1 from public.matches
    where tournament_id = v_tournament_id and scheduled_at is not null and (
      scheduled_at < timestamptz '2026-06-01 00:00:00+03'
      or scheduled_at >= timestamptz '2026-08-11 00:00:00+03'
    )
  ) then
    raise exception 'PRO_VĪRIEŠI: spēles datums ir ārpus 2026-06-01–2026-08-10 intervāla.';
  end if;

  if v_roberts_id is not null and exists (
    select 1 from public.group_players
    where group_id = v_group_id and player_id = v_roberts_id and status = 'active'
  ) then
    raise exception 'PRO_VĪRIEŠI: Roberts Pļāvējs nedrīkst būt grupas dalībnieks.';
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
      raise exception 'PRO_VĪRIEŠI: % punktiem jābūt %, bet aprēķināti %.',
        item ->> 'name', item ->> 'points', v_actual_points;
    end if;
  end loop;
end
$$;
