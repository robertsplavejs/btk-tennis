-- Ģenerēts no "BTK_VIENSPĒĻU TURNĪRS 2026.xlsx", lapas JAUNIEŠI.
-- Droši atkārtoti izpildāms jauniešu turnīra imports kopīgajā BTK 2026 sezonā.
do $$
declare
  v_club_id uuid;
  v_season_id constant uuid := 'd13aafc3-8449-48cf-ae6b-d1d2f462b08d';
  v_tournament_id constant uuid := 'd3a6f3dc-1160-4880-bac2-6d86eb316fcd';
  v_group_id constant uuid := 'dfaccb5a-ebb0-4480-9a3b-6b0919506074';
  item jsonb;
  match_item jsonb;
  set_item jsonb;
  v_player_one_id uuid;
  v_player_two_id uuid;
  v_winner_id uuid;
  imported_data constant jsonb := $data${"players":[{"name":"Evelīna Nauduža","initials":"EN","sourcePoints":10,"calculatedPoints":10,"id":"aaaf2e51-f41f-4251-9751-9cc30facc7de"},{"name":"Elza Tāle","initials":"ET","sourcePoints":10,"calculatedPoints":10,"id":"54fc0ff5-eb5f-42f4-a53c-d0ff6fd00932"},{"name":"Keitija Košinska","initials":"KK","sourcePoints":25,"calculatedPoints":25,"id":"debd8b7b-443b-4aca-9f94-89ea8502d7b0"},{"name":"Alesandra Anisimova","initials":"AA","sourcePoints":4,"calculatedPoints":4,"id":"061cfc22-c6e2-443b-a5c4-408204d92374"},{"name":"Alekss Kaupužs","initials":"AK","sourcePoints":9,"calculatedPoints":9,"id":"d26b526a-05a3-44e5-b92b-4489613d89b3"},{"name":"Elizabete Laicāne","initials":"EL","sourcePoints":3,"calculatedPoints":3,"id":"53d35cf1-a69c-41f4-ba5a-31257222a73a"},{"name":"Astra Griezne","initials":"AG","sourcePoints":3,"calculatedPoints":3,"id":"f5de8c19-c791-46c3-bef8-487c4f6cc4e9"},{"name":"Ralfs Mačuks","initials":"RM","sourcePoints":0,"calculatedPoints":0,"id":"f872307e-0a61-45d6-be8b-bae9c7b78504"},{"name":"Patriks Dudzinskis","initials":"PD","sourcePoints":2,"calculatedPoints":2,"id":"cd0914f8-07e5-487a-94f2-7cde5bcf2592"},{"name":"Eduards Dričs","initials":"ED","sourcePoints":3,"calculatedPoints":3,"id":"16375a31-5f8e-45b9-8bb9-8b6c63ce63a2"},{"name":"Adrians Čakans","initials":"AČ","sourcePoints":10,"calculatedPoints":11,"id":"eac7ff45-30dd-459d-a311-2a639366db25"}],"matches":[{"matchNumber":1,"playerOne":"Evelīna Nauduža","playerTwo":"Elza Tāle","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"25286e41-dc86-47ab-9a36-1f6679b07fe7"},{"matchNumber":2,"playerOne":"Evelīna Nauduža","playerTwo":"Keitija Košinska","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":3,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-19T12:00:00+03:00","sourceScore":"3:6 2:6","normalizedScore":"3:6 2:6","id":"88a94eaa-7d15-4c89-b525-f5f35a0f67ad"},{"matchNumber":3,"playerOne":"Evelīna Nauduža","playerTwo":"Alesandra Anisimova","played":true,"winner":"Evelīna Nauduža","sets":[{"number":1,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":3,"two":6,"oneTb":null,"twoTb":null},{"number":3,"type":"match_tiebreak","one":10,"two":5,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-26T13:00:00+03:00","sourceScore":"6:3 3:6 10:5","normalizedScore":"6:3 3:6 10:5","id":"f9836181-d1b4-44d4-8e6b-13b19ed4f93f"},{"matchNumber":4,"playerOne":"Evelīna Nauduža","playerTwo":"Alekss Kaupužs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"6650de18-4ef1-4617-9fdb-daf9be4ad95e"},{"matchNumber":5,"playerOne":"Evelīna Nauduža","playerTwo":"Elizabete Laicāne","played":true,"winner":"Evelīna Nauduža","sets":[{"number":1,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-09T15:00:00+03:00","sourceScore":"6:3 6:3","normalizedScore":"6:3 6:3","id":"ba751456-4616-4eeb-9988-5c1ee324a855"},{"matchNumber":6,"playerOne":"Evelīna Nauduža","playerTwo":"Astra Griezne","played":true,"winner":"Evelīna Nauduža","sets":[{"number":1,"type":"regular","one":7,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-06T12:00:00+03:00","sourceScore":"7:6(2) 6:3","normalizedScore":"7:6 6:3","id":"06375c34-bcd0-4079-bf21-a30074ae72fe"},{"matchNumber":7,"playerOne":"Evelīna Nauduža","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"4ec2e2fb-4cb4-4020-8341-7f35fc39bb95"},{"matchNumber":8,"playerOne":"Evelīna Nauduža","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"9ec88e98-6c48-4e19-9312-9e1cf4f38982"},{"matchNumber":9,"playerOne":"Evelīna Nauduža","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"3d11aa4e-d106-454e-b629-c2cb8bd43836"},{"matchNumber":10,"playerOne":"Evelīna Nauduža","playerTwo":"Adrians Čakans","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"91a3ca72-7cf9-4006-874a-9c646be1199d"},{"matchNumber":11,"playerOne":"Elza Tāle","playerTwo":"Keitija Košinska","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":1,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-11T13:00:00+03:00","sourceScore":"1:6 1:6","normalizedScore":"1:6 1:6","id":"1a552015-b258-4360-8b17-673df3515752"},{"matchNumber":12,"playerOne":"Elza Tāle","playerTwo":"Alesandra Anisimova","played":true,"winner":"Elza Tāle","sets":[{"number":1,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-18T14:00:00+03:00","sourceScore":"6:3 6:1","normalizedScore":"6:3 6:1","id":"1adc7316-890d-4ac3-833c-149618685c2c"},{"matchNumber":13,"playerOne":"Elza Tāle","playerTwo":"Alekss Kaupužs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"f82e6a78-66cc-4840-99be-f877b39bf091"},{"matchNumber":14,"playerOne":"Elza Tāle","playerTwo":"Elizabete Laicāne","played":true,"winner":"Elza Tāle","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-01T12:00:00+03:00","sourceScore":"6:1 6:4","normalizedScore":"6:1 6:4","id":"6854d71f-6e30-4b38-b5c7-46b415acc1be"},{"matchNumber":15,"playerOne":"Elza Tāle","playerTwo":"Astra Griezne","played":true,"winner":"Elza Tāle","sets":[{"number":1,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":3,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-08T13:00:00+03:00","sourceScore":"6:3  6:3","normalizedScore":"6:3 6:3","id":"d77451a4-5a25-4295-a1c1-e5a32618c871"},{"matchNumber":16,"playerOne":"Elza Tāle","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"82d78835-a2d3-42ad-af00-5a1caaa470a5"},{"matchNumber":17,"playerOne":"Elza Tāle","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"7e9dc7d8-3df2-491a-bf56-96574903bcd9"},{"matchNumber":18,"playerOne":"Elza Tāle","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0383c4b8-08c2-4a10-8b2c-0ecdb2b6aacb"},{"matchNumber":19,"playerOne":"Elza Tāle","playerTwo":"Adrians Čakans","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"fb37ab53-bc1d-48db-99d4-0bb9af106163"},{"matchNumber":20,"playerOne":"Keitija Košinska","playerTwo":"Alesandra Anisimova","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-03T14:00:00+03:00","sourceScore":"6:1 6:1","normalizedScore":"6:1 6:1","id":"2ad8c5d1-d0dc-4f63-99e7-e5ebe067526a"},{"matchNumber":21,"playerOne":"Keitija Košinska","playerTwo":"Alekss Kaupužs","played":true,"winner":"Alekss Kaupužs","sets":[{"number":1,"type":"regular","one":4,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":4,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-10T15:00:00+03:00","sourceScore":"4:6 4:6","normalizedScore":"4:6 4:6","id":"d86c48fc-8a79-420c-bebc-2f84e9553669"},{"matchNumber":22,"playerOne":"Keitija Košinska","playerTwo":"Elizabete Laicāne","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-17T12:00:00+03:00","sourceScore":"6:1 6:0","normalizedScore":"6:1 6:0","id":"db84c007-6be9-4e54-9c23-8f53646df1f1"},{"matchNumber":23,"playerOne":"Keitija Košinska","playerTwo":"Astra Griezne","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-24T13:00:00+03:00","sourceScore":"6:1 6:0","normalizedScore":"6:1 6:0","id":"09e5d98a-50d4-4700-b152-fd2a114f236c"},{"matchNumber":24,"playerOne":"Keitija Košinska","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"075b13d8-0769-4c71-af30-a9d44f85b1db"},{"matchNumber":25,"playerOne":"Keitija Košinska","playerTwo":"Patriks Dudzinskis","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-07T15:00:00+03:00","sourceScore":"6:0 6:0","normalizedScore":"6:0 6:0","id":"00ef3436-f292-4f67-b72f-4b002a66e4d8"},{"matchNumber":26,"playerOne":"Keitija Košinska","playerTwo":"Eduards Dričs","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-04T12:00:00+03:00","sourceScore":"6:1 6:0","normalizedScore":"6:1 6:0","id":"f0c2b05c-8a75-44d8-861f-5ce0f8201306"},{"matchNumber":27,"playerOne":"Keitija Košinska","playerTwo":"Adrians Čakans","played":true,"winner":"Keitija Košinska","sets":[{"number":1,"type":"regular","one":6,"two":2,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":1,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-11T13:00:00+03:00","sourceScore":"6:2 6:1","normalizedScore":"6:2 6:1","id":"b8ac30e8-b8c6-4bcd-a593-50e9b0cf423f"},{"matchNumber":28,"playerOne":"Alesandra Anisimova","playerTwo":"Alekss Kaupužs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"a930fb0d-c508-4a6a-a55d-74e659e25a4e"},{"matchNumber":29,"playerOne":"Alesandra Anisimova","playerTwo":"Elizabete Laicāne","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"851d54ea-db6b-4fe3-ae2d-947341768f14"},{"matchNumber":30,"playerOne":"Alesandra Anisimova","playerTwo":"Astra Griezne","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"fe4112a4-0589-4727-9eda-376627f3a319"},{"matchNumber":31,"playerOne":"Alesandra Anisimova","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"bf42282e-cc77-4c22-88f1-31d0059fec3e"},{"matchNumber":32,"playerOne":"Alesandra Anisimova","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"b48cc26c-df25-4d35-b626-50ec73915ced"},{"matchNumber":33,"playerOne":"Alesandra Anisimova","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"f29b0f14-0339-4ffd-b3e4-e0f99b18d351"},{"matchNumber":34,"playerOne":"Alesandra Anisimova","playerTwo":"Adrians Čakans","played":true,"winner":"Adrians Čakans","sets":[{"number":1,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":3,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-30T12:00:00+03:00","sourceScore":"2:6 3:6","normalizedScore":"2:6 3:6","id":"f43be6ea-e9a1-4dce-9e2f-aea69b41f590"},{"matchNumber":35,"playerOne":"Alekss Kaupužs","playerTwo":"Elizabete Laicāne","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"a9eb1dfc-0e4c-4df7-91fc-cd8043eb4b4d"},{"matchNumber":36,"playerOne":"Alekss Kaupužs","playerTwo":"Astra Griezne","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"ad01047b-1309-4f3c-8168-86a7294ac9e1"},{"matchNumber":37,"playerOne":"Alekss Kaupužs","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"d981c04c-a6a6-40a8-82c3-0d34c976667b"},{"matchNumber":38,"playerOne":"Alekss Kaupužs","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"66ae3e04-3f8a-465d-bef4-75c9cbc34916"},{"matchNumber":39,"playerOne":"Alekss Kaupužs","playerTwo":"Eduards Dričs","played":true,"winner":"Alekss Kaupužs","sets":[{"number":1,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":6,"two":0,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-06-24T13:00:00+03:00","sourceScore":"6:4 6:0","normalizedScore":"6:4 6:0","id":"1652b18f-df09-415b-bb9b-eeb884b6bc5e"},{"matchNumber":40,"playerOne":"Alekss Kaupužs","playerTwo":"Adrians Čakans","played":true,"winner":"Alekss Kaupužs","sets":[{"number":1,"type":"regular","one":6,"two":4,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":5,"two":7,"oneTb":null,"twoTb":null},{"number":3,"type":"match_tiebreak","one":14,"two":12,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-01T14:00:00+03:00","sourceScore":"6:4 5:7 (14:12)","normalizedScore":"6:4 5:7 14:12","id":"68b71443-3ef3-4a6c-be63-e44653f35883"},{"matchNumber":41,"playerOne":"Elizabete Laicāne","playerTwo":"Astra Griezne","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"a523945a-551a-41ae-8115-0b2a422f9ba0"},{"matchNumber":42,"playerOne":"Elizabete Laicāne","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"87a448db-e213-4bb1-80b5-934274d14b23"},{"matchNumber":43,"playerOne":"Elizabete Laicāne","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"02c46b8f-20f6-470b-8677-e9102b907448"},{"matchNumber":44,"playerOne":"Elizabete Laicāne","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"3782fb5c-a482-4790-8f02-f865744ee784"},{"matchNumber":45,"playerOne":"Elizabete Laicāne","playerTwo":"Adrians Čakans","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"25d95017-93f7-43b6-aa73-13c6854999e0"},{"matchNumber":46,"playerOne":"Astra Griezne","playerTwo":"Ralfs Mačuks","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"d2289579-d6b6-47f0-813a-0593a4f8bfd7"},{"matchNumber":47,"playerOne":"Astra Griezne","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"5bbeb2d2-d006-487c-8f46-8584f4dce9b0"},{"matchNumber":48,"playerOne":"Astra Griezne","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"1412a267-1bcd-436c-99d5-f875e715695b"},{"matchNumber":49,"playerOne":"Astra Griezne","playerTwo":"Adrians Čakans","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"3ff4dac6-784d-4d3a-9235-79ab20d7425b"},{"matchNumber":50,"playerOne":"Ralfs Mačuks","playerTwo":"Patriks Dudzinskis","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"44b2d959-1c2d-433c-805a-ffeae0df420a"},{"matchNumber":51,"playerOne":"Ralfs Mačuks","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0c4226fa-32d3-4a8c-aecf-85b388b24b89"},{"matchNumber":52,"playerOne":"Ralfs Mačuks","playerTwo":"Adrians Čakans","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"0840b371-08c7-4827-885a-0465746eedaf"},{"matchNumber":53,"playerOne":"Patriks Dudzinskis","playerTwo":"Eduards Dričs","played":false,"winner":null,"sets":[],"scheduledAt":null,"sourceScore":null,"normalizedScore":null,"id":"b2bf81ef-9634-4ca9-bf59-5e3c7ac11f0e"},{"matchNumber":54,"playerOne":"Patriks Dudzinskis","playerTwo":"Adrians Čakans","played":true,"winner":"Adrians Čakans","sets":[{"number":1,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-07-28T12:00:00+03:00","sourceScore":"0:6 0:6","normalizedScore":"0:6 0:6","id":"068a8cb7-304d-4054-b6b0-deca5d07d280"},{"matchNumber":55,"playerOne":"Eduards Dričs","playerTwo":"Adrians Čakans","played":true,"winner":"Adrians Čakans","sets":[{"number":1,"type":"regular","one":0,"two":6,"oneTb":null,"twoTb":null},{"number":2,"type":"regular","one":2,"two":6,"oneTb":null,"twoTb":null}],"scheduledAt":"2026-08-04T13:00:00+03:00","sourceScore":"0:6 2:6","normalizedScore":"0:6 2:6","id":"7ebaddb7-b395-4b2c-bb17-36753f6b80dc"}]}$data$::jsonb;
begin
  select id into v_club_id from public.clubs where slug = 'btk' limit 1;
  if v_club_id is null then raise exception 'BTK klubs nav atrasts.'; end if;

  create temporary table youth_player_map (
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

    insert into youth_player_map values (item ->> 'name', v_player_one_id)
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
    v_tournament_id, v_season_id, 'BTK jauniešu vienspēļu turnīrs 2026',
    'jauniesi-2026', 'active', 8, 3, 1
  ) on conflict (id) do update set
    name = excluded.name,
    status = excluded.status,
    qualification_places = excluded.qualification_places,
    points_for_win = excluded.points_for_win,
    points_for_loss = excluded.points_for_loss,
    updated_at = now();

  insert into public.groups (id, tournament_id, name, slug)
  values (v_group_id, v_tournament_id, 'Jaunieši', 'main')
  on conflict (id) do update set name = excluded.name, updated_at = now();

  insert into public.group_players (group_id, player_id, seed, status, joined_at)
  select v_group_id, player_id, row_number() over (order by full_name), 'active',
    timestamptz '2026-06-01 09:00:00+03'
  from youth_player_map
  on conflict (group_id, player_id) where status = 'active' do update set updated_at = now();

  for match_item in select * from jsonb_array_elements(imported_data -> 'matches') loop
    select player_id into v_player_one_id from youth_player_map
      where full_name = match_item ->> 'playerOne';
    select player_id into v_player_two_id from youth_player_map
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
        'Importēts no 2026. gada jauniešu tabulas. Oriģinālais rezultāts: ' || (match_item ->> 'sourceScore')
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
