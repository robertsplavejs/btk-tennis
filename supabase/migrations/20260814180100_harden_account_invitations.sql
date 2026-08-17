-- Uzaicinājumu vēsture nedrīkst bloķēt konta dzēšanu. Saglabājam pašu
-- uzaicinājumu, bet dzēsta konta atsauci atstājam tukšu.
alter table public.account_invitations
  alter column invited_by drop not null;

alter table public.account_invitations
  drop constraint account_invitations_invited_by_fkey,
  add constraint account_invitations_invited_by_fkey
    foreign key (invited_by)
    references public.user_accounts(user_id)
    on delete set null;

alter table public.account_invitations
  drop constraint account_invitations_accepted_by_fkey,
  add constraint account_invitations_accepted_by_fkey
    foreign key (accepted_by)
    references public.user_accounts(user_id)
    on delete set null;

-- Spēles vēstures ierakstiem jāspēj parādīt autora spēlētāja profilu.
-- Tabulā nav e-pasta vai citu slepenu Auth datu.
create policy "Authenticated users can view account player links"
on public.user_accounts
for select
to authenticated
using (true);

do $$
declare
  trigger_function text;
begin
  if to_regclass('public.account_invitations') is null then
    raise exception 'account_invitations table was not created';
  end if;

  select action_statement
  into trigger_function
  from information_schema.triggers
  where trigger_schema = 'auth'
    and event_object_table = 'users'
    and trigger_name = 'on_auth_user_created';

  if trigger_function is null
    or trigger_function not like '%handle_new_auth_user%'
  then
    raise exception 'Invitation auth trigger is not active';
  end if;

  if not exists (
    select 1
    from pg_proc procedure
    join pg_namespace namespace
      on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.proname = 'create_account_invitation'
  ) then
    raise exception 'create_account_invitation function is missing';
  end if;
end;
$$;
