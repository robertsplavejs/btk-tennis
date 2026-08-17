-- Audita ierakstos glabājam ielogošanās kontu, savukārt spēles
-- dalībnieka tiesības pārbaudām pret kontam piesaistīto player_id.

-- Vecajos datos rezultāta ievadītājs bija spēlētāja ID. Atstājam tikai
-- tos ierakstus, kuriem eksistē atbilstošs ielogošanās konts.
update public.matches match
set result_entered_by = null
where match.result_entered_by is not null
  and not exists (
    select 1
    from public.user_accounts account
    where account.user_id = match.result_entered_by
  );

update public.match_history history
set user_id = null
where history.user_id is not null
  and not exists (
    select 1
    from public.user_accounts account
    where account.user_id = history.user_id
  );

alter table public.matches
drop constraint if exists matches_result_entered_by_fkey;

alter table public.matches
add constraint matches_result_entered_by_fkey
foreign key (result_entered_by)
references public.user_accounts(user_id)
on delete set null;

alter table public.match_history
drop constraint if exists match_history_user_id_fkey;

alter table public.match_history
add constraint match_history_user_id_fkey
foreign key (user_id)
references public.user_accounts(user_id)
on delete set null;

create or replace function public.is_match_participant(
  target_match_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.matches match
    where match.id = target_match_id
      and (select public.current_player_id()) in (
        match.player_one_id,
        match.player_two_id
      )
  );
$$;

revoke all on function public.is_match_participant(uuid) from public;
grant execute on function public.is_match_participant(uuid) to authenticated;

drop policy if exists "Participants can update their own matches"
on public.matches;

create policy "Participants can update their own matches"
on public.matches
for update
to authenticated
using (
  (select public.current_player_id()) in (
    player_one_id,
    player_two_id
  )
)
with check (
  (select public.current_player_id()) in (
    player_one_id,
    player_two_id
  )
);

create or replace function private.can_access_match_history(
  target_match_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select public.is_admin())
    or exists (
      select 1
      from public.matches match
      where match.id = target_match_id
        and (select public.current_player_id()) in (
          match.player_one_id,
          match.player_two_id
        )
    );
$$;

-- Esošā validētā rezultāta funkcija jau korekti saglabā auth.uid()
-- kā auditējamo kontu. Mainām tikai tās dalībnieka pārbaudi, lai tā
-- izmantotu current_player_id(). Migrācija apstājas, ja gaidītais
-- iepriekšējās funkcijas fragments nav atrodams.
do $$
declare
  function_definition text;
  old_fragment constant text :=
    'and current_user_id <> referenced_match.player_one_id'
    || chr(10)
    || '     and current_user_id <> referenced_match.player_two_id';
  new_fragment constant text :=
    'and (select public.current_player_id()) <> referenced_match.player_one_id'
    || chr(10)
    || '     and (select public.current_player_id()) <> referenced_match.player_two_id';
begin
  function_definition := pg_get_functiondef(
    'public.save_match_result_internal(uuid,jsonb)'::regprocedure
  );

  if position(old_fragment in function_definition) = 0 then
    raise exception 'Neizdevās atrast rezultāta funkcijas dalībnieka pārbaudi.';
  end if;

  execute replace(function_definition, old_fragment, new_fragment);
end;
$$;

comment on column public.matches.result_entered_by is
'Ielogošanās konts, kas pēdējais ievadīja vai laboja spēles rezultātu.';

comment on column public.match_history.user_id is
'Ielogošanās konts, kas veica auditēto spēles darbību.';
