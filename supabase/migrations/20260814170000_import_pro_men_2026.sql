-- Ģenerēts no "BTK_VIENSPĒĻU TURNĪRS 2026.xlsx", lapas PRO_VĪRIEŠI.
-- Droši atkārtoti izpildāms PRO vīriešu turnīra imports kopīgajā BTK 2026 sezonā.
do $$
declare
  v_club_id uuid;
  v_season_id constant uuid := 'd13aafc3-8449-48cf-ae6b-d1d2f462b08d';
  v_tournament_id constant uuid := 'aac22ac1-7d16-439c-adf6-143916ac3504';
  v_group_id constant uuid := '446481e6-6db8-405e-b1be-af7d79720ac2';
  item jsonb;
  match_item jsonb;
  set_item jsonb;
  v_player_one_id uuid;
  v_player_two_id uuid;
  v_winner_id uuid;
  imported_data constant jsonb := $data${"players":[{"name":"Edijs Kriķis","initials":"EK","sourcePoints":12,"calculatedPoints":12,"id":"c961eb75-d24e-43dd-8918-2ab96faa4aa5"},{"name":"Kalvis Ķiesneris","initials":"KĶ","sourcePoints":5,"calculatedPoints":5,"id":"b4d5d032-a43a-423f-885f-8dff83cf84bc"},{"name":"Rinalds Rozenfelds","initials":"RR","sourcePoints":8,"calculatedPoints":8,"id":"f1762733-ef87-4c6c-8cb6-474f92e7ad79"},{"name":"Roberts Gandzjuks","initials":"RG","sourcePoints":6,"calculatedPoints":6,"id":"2a2d01d9-4b70-42cf-b781-857a3b6b18e3"},{"name":"Kārlis Leja","initials":"KL","sourcePoints":1,"calculatedPoints":1,"id":"114cc5c8-c450-4147-b57f-282abe0d32c9"},{"name":"Ainārs Juškēvičs","initials":"AJ","sourcePoints":3,"calculatedPoints":3,"id":"4594ad1c-d399-459d-8072-32c530afc973"},{"name":"Jānis Kļaviņš","initials":"JK","sourcePoints":15,"calculatedPoints":15,"id":"df978648-89fa-4a4a-af69-bde77bde622a"},{"name":"Antons Naumenko","initials":"AN","sourcePoints":0,"calculatedPoints":0,"id":"52e9ebf4-aa64-402e-8cef-fce1a0dc934a"},{"name":"Armands Stokmanis","initials":"AS","sourcePoints":0,"calculatedPoints":0,"id":"47e24fbc-665a-47ac-8520-477568a268b1"},{"name":"Artis Inda","initials":"AI","sourcePoints":10,"calculatedPoints":10,"id":"a8acb952-c438-441d-b4d7-ff5c3268bae6"},{"name":"Gatis Dejus","initials":"GD","sourcePoints":8,"calculatedPoints":8,"id":"05c1823c-d274-4f6d-aff2-0091a4f2b4d1"}],"matches":[{"matchNumber":1,"playerOne":"Edijs Kriķis","playerTwo":"Kalvis Ķiesneris","played":true,"winner":"Edijs Kriķis","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-08T13:00:00+03:00","sourceScore":"6:1 6:1","normalizedScore":"6:1 6:1","id":"88116052-faf7-4b21-a030-a693f2e19cec"},{"matchNumber":2,"playerOne":"Edijs Kriķis","playerTwo":"Rinalds Rozenfelds","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"c1656ef7-1687-43ed-bc1d-e09c10397c15"},{"matchNumber":3,"playerOne":"Edijs Kriķis","playerTwo":"Roberts Gandzjuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"53eb6be2-85c8-482f-a162-09cefa09c01e"},{"matchNumber":4,"playerOne":"Edijs Kriķis","playerTwo":"Kārlis Leja","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0d33b098-434a-4d82-a3e7-31a332eda0f1"},{"matchNumber":5,"playerOne":"Edijs Kriķis","playerTwo":"Ainārs Juškēvičs","played":true,"winner":"Edijs Kriķis","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-06T13:00:00+03:00","sourceScore":"6:1 6:1","normalizedScore":"6:1 6:1","id":"7b731c20-7e96-45f1-9fbe-5018286a9a6a"},{"matchNumber":6,"playerOne":"Edijs Kriķis","playerTwo":"Jānis Kļaviņš","played":true,"winner":"Edijs Kriķis","sets":[{"number":1,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":2,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-13T14:00:00+03:00","sourceScore":"6:0 6:2","normalizedScore":"6:0 6:2","id":"467970a8-0cc8-4a3a-bbfc-7a4b01ae6e3c"},{"matchNumber":7,"playerOne":"Edijs Kriķis","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"ddb25315-3eff-4534-a676-9a2b62218532"},{"matchNumber":8,"playerOne":"Edijs Kriķis","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"17d3a663-a7d2-41e9-911d-ab6bad0c76a0"},{"matchNumber":9,"playerOne":"Edijs Kriķis","playerTwo":"Artis Inda","played":true,"winner":"Edijs Kriķis","sets":[{"number":1,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null},{"number":3,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-03T13:00:00+03:00","sourceScore":"1:6 6:4 6:3","normalizedScore":"1:6 6:4 6:3","id":"4a25f058-55ce-408a-a28e-5efad83198b8"},{"matchNumber":10,"playerOne":"Edijs Kriķis","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"3ba3f35a-009f-40ae-99e0-423addf3a131"},{"matchNumber":11,"playerOne":"Kalvis Ķiesneris","playerTwo":"Rinalds Rozenfelds","played":true,"winner":"Rinalds Rozenfelds","sets":[{"number":1,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":3,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-07T15:00:00+03:00","sourceScore":"1:6 3:6","normalizedScore":"1:6 3:6","id":"7b5fb461-aeb6-402e-a804-5cc0bea857f8"},{"matchNumber":12,"playerOne":"Kalvis Ķiesneris","playerTwo":"Roberts Gandzjuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"52c16062-d60b-4109-81ba-1ec59f003935"},{"matchNumber":13,"playerOne":"Kalvis Ķiesneris","playerTwo":"Kārlis Leja","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"14cab87a-8c02-4dd5-bc08-a70bf13df36b"},{"matchNumber":14,"playerOne":"Kalvis Ķiesneris","playerTwo":"Ainārs Juškēvičs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"7716b5d9-a91f-45e8-a067-e5447029dc70"},{"matchNumber":15,"playerOne":"Kalvis Ķiesneris","playerTwo":"Jānis Kļaviņš","played":true,"winner":"Jānis Kļaviņš","sets":[{"number":1,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-05T15:00:00+03:00","sourceScore":"1:6 1:6","normalizedScore":"1:6 1:6","id":"b9749119-7d8d-4074-95cb-439e62b3a45e"},{"matchNumber":16,"playerOne":"Kalvis Ķiesneris","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"499fff93-4e9b-4cb2-a975-d5d5163591bf"},{"matchNumber":17,"playerOne":"Kalvis Ķiesneris","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0f952864-1b1c-46f9-814c-888cbbfc9f3a"},{"matchNumber":18,"playerOne":"Kalvis Ķiesneris","playerTwo":"Artis Inda","played":true,"winner":"Artis Inda","sets":[{"number":1,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-26T14:00:00+03:00","sourceScore":"1:6 2:6","normalizedScore":"1:6 2:6","id":"b0df4e5c-e2e4-483a-9c22-c5832d1ef865"},{"matchNumber":19,"playerOne":"Kalvis Ķiesneris","playerTwo":"Gatis Dejus","played":true,"winner":"Gatis Dejus","sets":[{"number":1,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-02T15:00:00+03:00","sourceScore":"2:6 1:6","normalizedScore":"2:6 1:6","id":"0fe05d16-16ad-4b0a-aa38-dbefab176bde"},{"matchNumber":20,"playerOne":"Rinalds Rozenfelds","playerTwo":"Roberts Gandzjuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0196af4b-f462-4e2d-b00c-51e6048d1f21"},{"matchNumber":21,"playerOne":"Rinalds Rozenfelds","playerTwo":"Kārlis Leja","played":true,"winner":"Rinalds Rozenfelds","sets":[{"number":1,"type":"regular","one":6,"two":2,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-06T13:00:00+03:00","sourceScore":"6:2 6:0","normalizedScore":"6:2 6:0","id":"cbe3615e-5c74-4965-843e-938ba2a5bb4f"},{"matchNumber":22,"playerOne":"Rinalds Rozenfelds","playerTwo":"Ainārs Juškēvičs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"af974750-caf9-49fe-ad0e-31bdbb686f26"},{"matchNumber":23,"playerOne":"Rinalds Rozenfelds","playerTwo":"Jānis Kļaviņš","played":true,"winner":"Jānis Kļaviņš","sets":[{"number":1,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":7,"oneTb":null,"twoTb":null},{"number":3,"type":"match_tiebreak","one":7,"two":10,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-20T15:00:00+03:00","sourceScore":"6:4 6:7(5) 7:10","normalizedScore":"6:4 6:7 7:10","id":"dc2a2d2c-716f-4af3-8874-cfd4e0425660"},{"matchNumber":24,"playerOne":"Rinalds Rozenfelds","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"70ee43b8-9ab9-4540-86f7-b73c7d6c880a"},{"matchNumber":25,"playerOne":"Rinalds Rozenfelds","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"f24d5bf4-ebe0-4feb-8ba4-23e2e37014d6"},{"matchNumber":26,"playerOne":"Rinalds Rozenfelds","playerTwo":"Artis Inda","played":true,"winner":"Artis Inda","sets":[{"number":1,"type":"regular","one":7,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":3,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-11T14:00:00+03:00","sourceScore":"7:6(5) 1:6 2:6","normalizedScore":"7:6 1:6 2:6","id":"04e7afde-b32b-4f52-ae33-3262fef2a865"},{"matchNumber":27,"playerOne":"Rinalds Rozenfelds","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"1d5e68a4-0fae-48f3-81bc-86ad00712665"},{"matchNumber":28,"playerOne":"Roberts Gandzjuks","playerTwo":"Kārlis Leja","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"79ba5eaa-9bf3-4cd6-a1ab-3af30292177b"},{"matchNumber":29,"playerOne":"Roberts Gandzjuks","playerTwo":"Ainārs Juškēvičs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"74053b75-9c81-4c76-97db-15b79f95fa4b"},{"matchNumber":30,"playerOne":"Roberts Gandzjuks","playerTwo":"Jānis Kļaviņš","played":true,"winner":"Roberts Gandzjuks","sets":[{"number":1,"type":"regular","one":6,"two":2,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-08T14:00:00+03:00","sourceScore":"6:2 6:3","normalizedScore":"6:2 6:3","id":"c50aa7d8-d9b7-4c56-8fc1-f7b3564e241e"},{"matchNumber":31,"playerOne":"Roberts Gandzjuks","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"99060301-80bc-44de-8bda-24f8e4e39eff"},{"matchNumber":32,"playerOne":"Roberts Gandzjuks","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"2df72ad3-b7e6-4896-a56a-b7bef3988730"},{"matchNumber":33,"playerOne":"Roberts Gandzjuks","playerTwo":"Artis Inda","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"70ab8d07-82aa-45d2-927b-743ed64b3c5b"},{"matchNumber":34,"playerOne":"Roberts Gandzjuks","playerTwo":"Gatis Dejus","played":true,"winner":"Roberts Gandzjuks","sets":[{"number":1,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-26T14:00:00+03:00","sourceScore":"6:3 6:4","normalizedScore":"6:3 6:4","id":"cb120468-1d43-4136-b958-8a3c92ffee38"},{"matchNumber":35,"playerOne":"Kārlis Leja","playerTwo":"Ainārs Juškēvičs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"4c69b0a3-370e-4aa2-a141-6c91c3972f9e"},{"matchNumber":36,"playerOne":"Kārlis Leja","playerTwo":"Jānis Kļaviņš","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"e112b586-50f7-42fe-8a0f-c8d95d543456"},{"matchNumber":37,"playerOne":"Kārlis Leja","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"b6fba6d6-987d-4870-9143-479550c7c6a5"},{"matchNumber":38,"playerOne":"Kārlis Leja","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"321f655f-c446-49e4-97a9-72522394053d"},{"matchNumber":39,"playerOne":"Kārlis Leja","playerTwo":"Artis Inda","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"38b48b8f-300f-4618-b83c-61e2d38380d4"},{"matchNumber":40,"playerOne":"Kārlis Leja","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"9230c874-9de3-4231-a4d8-c81c02a0c22d"},{"matchNumber":41,"playerOne":"Ainārs Juškēvičs","playerTwo":"Jānis Kļaviņš","played":true,"winner":"Jānis Kļaviņš","sets":[{"number":1,"type":"regular","one":4,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":5,"two":7,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-04T13:00:00+03:00","sourceScore":"4:6 5:7","normalizedScore":"4:6 5:7","id":"fe425042-f8f1-48f9-819d-4e29d1187bc6"},{"matchNumber":42,"playerOne":"Ainārs Juškēvičs","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"c69f7afc-45e9-45cd-abdf-229ac3173dcf"},{"matchNumber":43,"playerOne":"Ainārs Juškēvičs","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"21abeb1f-22e5-4027-abf6-df22b5aa5919"},{"matchNumber":44,"playerOne":"Ainārs Juškēvičs","playerTwo":"Artis Inda","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"5ccf6d8c-b91c-4b02-879e-40c413171980"},{"matchNumber":45,"playerOne":"Ainārs Juškēvičs","playerTwo":"Gatis Dejus","played":true,"winner":"Gatis Dejus","sets":[{"number":1,"type":"regular","one":6,"two":7,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-02T13:00:00+03:00","sourceScore":"6:7(5) 0:6","normalizedScore":"6:7 0:6","id":"e4c0700d-73de-4ad9-8f0c-212548eb796e"},{"matchNumber":46,"playerOne":"Jānis Kļaviņš","playerTwo":"Antons Naumenko","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"28f37b1b-3c84-48d6-97c6-39641cb02207"},{"matchNumber":47,"playerOne":"Jānis Kļaviņš","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"a654fee6-148a-4c30-8be0-ddcb8b22cc38"},{"matchNumber":48,"playerOne":"Jānis Kļaviņš","playerTwo":"Artis Inda","played":true,"winner":"Artis Inda","sets":[{"number":1,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-23T12:00:00+03:00","sourceScore":"0:6 0:6","normalizedScore":"0:6 0:6","id":"2b723be0-caee-4d5f-b397-824cdb1447fe"},{"matchNumber":49,"playerOne":"Jānis Kļaviņš","playerTwo":"Gatis Dejus","played":true,"winner":"Jānis Kļaviņš","sets":[{"number":1,"type":"regular","one":6,"two":7,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null},{"number":3,"type":"match_tiebreak","one":10,"two":7,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-30T13:00:00+03:00","sourceScore":"6:7(5) 6:4 10:7","normalizedScore":"6:7 6:4 10:7","id":"dfdf4bc9-ecf9-414c-9db8-a742ec052451"},{"matchNumber":50,"playerOne":"Antons Naumenko","playerTwo":"Armands Stokmanis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"de24ac09-4736-43be-811b-ab688401e11e"},{"matchNumber":51,"playerOne":"Antons Naumenko","playerTwo":"Artis Inda","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"98e70b59-b9a4-450b-b826-13a4db5524f1"},{"matchNumber":52,"playerOne":"Antons Naumenko","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"a70c9d42-6f64-45d0-932b-d570451ff78f"},{"matchNumber":53,"playerOne":"Armands Stokmanis","playerTwo":"Artis Inda","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"9495bc0e-fd8e-4c21-a76e-c0d40d287489"},{"matchNumber":54,"playerOne":"Armands Stokmanis","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"4d2a8161-73ab-4c41-baa8-24ea6dc471fa"},{"matchNumber":55,"playerOne":"Artis Inda","playerTwo":"Gatis Dejus","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"2a7ff035-ec00-4b19-8a00-4873bc03a5d1"}]}$data$::jsonb;
begin
  select id into v_club_id from public.clubs where slug = 'btk' limit 1;
  if v_club_id is null then raise exception 'BTK klubs nav atrasts.'; end if;

  create temporary table pro_men_player_map (
    full_name text primary key,
    player_id uuid not null
  ) on commit drop;

  for item in select * from jsonb_array_elements(imported_data -> 'players') loop
    select id into v_player_one_id
    from public.players
    where lower(regexp_replace(trim(full_name), '\s+', ' ', 'g')) =
      lower(regexp_replace(trim(item ->> 'name'), '\s+', ' ', 'g'))
    order by is_admin desc, created_at asc
    limit 1;

    if v_player_one_id is null then
      v_player_one_id := (item ->> 'id')::uuid;
      insert into public.players (id, club_id, full_name, initials, is_admin)
      values (v_player_one_id, v_club_id, item ->> 'name', item ->> 'initials', false)
      on conflict (id) do update set
        club_id = excluded.club_id,
        full_name = excluded.full_name,
        initials = excluded.initials,
        updated_at = now();
    end if;

    insert into pro_men_player_map values (item ->> 'name', v_player_one_id)
    on conflict (full_name) do update set player_id = excluded.player_id;
  end loop;

  insert into public.seasons (id, club_id, name, starts_on, ends_on, is_active)
  values (v_season_id, v_club_id, 'BTK 2026', date '2026-06-01', date '2026-08-31', true)
  on conflict (id) do update set
    name = excluded.name,
    starts_on = excluded.starts_on,
    ends_on = excluded.ends_on,
    is_active = excluded.is_active,
    updated_at = now();

  insert into public.tournaments (
    id, season_id, name, slug, status, qualification_places, points_for_win, points_for_loss
  ) values (
    v_tournament_id, v_season_id, 'BTK PRO vīriešu vienspēļu turnīrs 2026',
    'pro-viriesi-2026', 'active', 8, 3, 1
  ) on conflict (id) do update set
    name = excluded.name,
    status = excluded.status,
    qualification_places = excluded.qualification_places,
    points_for_win = excluded.points_for_win,
    points_for_loss = excluded.points_for_loss,
    updated_at = now();

  insert into public.groups (id, tournament_id, name, slug)
  values (v_group_id, v_tournament_id, 'PRO vīrieši', 'main')
  on conflict (id) do update set name = excluded.name, updated_at = now();

  insert into public.group_players (group_id, player_id, seed, status, joined_at)
  select v_group_id, player_id, row_number() over (order by full_name), 'active',
    timestamptz '2026-06-01 09:00:00+03'
  from pro_men_player_map
  on conflict (group_id, player_id) where status = 'active' do update set updated_at = now();

  for match_item in select * from jsonb_array_elements(imported_data -> 'matches') loop
    select player_id into v_player_one_id from pro_men_player_map
      where full_name = match_item ->> 'playerOne';
    select player_id into v_player_two_id from pro_men_player_map
      where full_name = match_item ->> 'playerTwo';

    v_winner_id := null;
    if match_item ->> 'winner' = match_item ->> 'playerOne' then
      v_winner_id := v_player_one_id;
    elsif match_item ->> 'winner' = match_item ->> 'playerTwo' then
      v_winner_id := v_player_two_id;
    end if;

    insert into public.matches (
      id, tournament_id, group_id, player_one_id, player_two_id, status,
      scheduled_at, winner_id, result_entered_by, result_type, round_number,
      match_number, notes, created_at, updated_at
    ) values (
      (match_item ->> 'id')::uuid, v_tournament_id, v_group_id,
      v_player_one_id, v_player_two_id,
      case when (match_item ->> 'played')::boolean then 'completed' else 'unscheduled' end,
      nullif(match_item ->> 'scheduledAt', '')::timestamptz,
      v_winner_id, null, 'regular', 1,
      (match_item ->> 'matchNumber')::integer,
      case when match_item ->> 'sourceScore' is not null then
        'Importēts no 2026. gada PRO vīriešu tabulas. Oriģinālais rezultāts: ' || (match_item ->> 'sourceScore')
      else null end,
      coalesce(nullif(match_item ->> 'scheduledAt', '')::timestamptz,
        timestamptz '2026-06-01 09:00:00+03'),
      coalesce(nullif(match_item ->> 'scheduledAt', '')::timestamptz,
        timestamptz '2026-06-01 09:00:00+03')
    ) on conflict (id) do update set
      status = excluded.status,
      scheduled_at = excluded.scheduled_at,
      winner_id = excluded.winner_id,
      result_entered_by = excluded.result_entered_by,
      result_type = excluded.result_type,
      match_number = excluded.match_number,
      notes = excluded.notes,
      updated_at = excluded.updated_at;

    delete from public.match_sets where match_id = (match_item ->> 'id')::uuid;
    for set_item in select * from jsonb_array_elements(match_item -> 'sets') loop
      insert into public.match_sets (
        match_id, set_number, set_type, player_one_score, player_two_score,
        player_one_tiebreak_points, player_two_tiebreak_points
      ) values (
        (match_item ->> 'id')::uuid,
        (set_item ->> 'number')::integer,
        set_item ->> 'type',
        (set_item ->> 'one')::integer,
        (set_item ->> 'two')::integer,
        nullif(set_item ->> 'oneTb', '')::integer,
        nullif(set_item ->> 'twoTb', '')::integer
      );
    end loop;
  end loop;
end
$$;
