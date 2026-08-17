do $$
declare
  missing_account_count integer;
  missing_player_link_count integer;
  admin_mismatch_count integer;
begin
  select count(*)
  into missing_account_count
  from auth.users auth_user
  left join public.user_accounts account
    on account.user_id = auth_user.id
  where account.user_id is null;

  if missing_account_count <> 0 then
    raise exception
      'Kontu migrācijas pārbaude neizdevās: % Auth lietotājiem nav user_accounts ieraksta.',
      missing_account_count;
  end if;

  select count(*)
  into missing_player_link_count
  from auth.users auth_user
  join public.players player
    on player.id = auth_user.id
  left join public.user_accounts account
    on account.user_id = auth_user.id
   and account.player_id = player.id
  where account.user_id is null;

  if missing_player_link_count <> 0 then
    raise exception
      'Kontu migrācijas pārbaude neizdevās: % esošie spēlētāju konti nav piesaistīti profilam.',
      missing_player_link_count;
  end if;

  select count(*)
  into admin_mismatch_count
  from public.players player
  join public.user_accounts account
    on account.player_id = player.id
  where player.is_admin is distinct from account.is_admin;

  if admin_mismatch_count <> 0 then
    raise exception
      'Kontu migrācijas pārbaude neizdevās: % kontiem administratora loma nesakrīt ar iepriekšējo modeli.',
      admin_mismatch_count;
  end if;
end;
$$;
