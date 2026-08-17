do $$
begin
  if exists (
    select 1
    from public.matches match
    left join public.user_accounts account
      on account.user_id = match.result_entered_by
    where match.result_entered_by is not null
      and account.user_id is null
  ) then
    raise exception 'Atrasts rezultāta ievadītājs bez ielogošanās konta.';
  end if;

  if exists (
    select 1
    from public.match_history history
    left join public.user_accounts account
      on account.user_id = history.user_id
    where history.user_id is not null
      and account.user_id is null
  ) then
    raise exception 'Atrasts spēles audita ieraksts bez ielogošanās konta.';
  end if;

  if not exists (
    select 1
    from pg_constraint constraint_record
    where constraint_record.conname = 'matches_result_entered_by_fkey'
      and constraint_record.confrelid = 'public.user_accounts'::regclass
  ) then
    raise exception 'matches.result_entered_by nav piesaistīts user_accounts.';
  end if;

  if not exists (
    select 1
    from pg_constraint constraint_record
    where constraint_record.conname = 'match_history_user_id_fkey'
      and constraint_record.confrelid = 'public.user_accounts'::regclass
  ) then
    raise exception 'match_history.user_id nav piesaistīts user_accounts.';
  end if;

  if position(
    'current_player_id'
    in pg_get_functiondef(
      'public.save_match_result_internal(uuid,jsonb)'::regprocedure
    )
  ) = 0 then
    raise exception 'Rezultāta funkcija neizmanto piesaistīto spēlētāja profilu.';
  end if;
end;
$$;
