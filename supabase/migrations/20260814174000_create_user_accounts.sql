-- Ielogošanās konts, spēlētāja profils un administratora loma ir
-- atsevišķi jēdzieni. Spēlētāja profils nav obligāts, tāpēc arī
-- administratoriem, kuri nepiedalās turnīros, nav jārada viltus profils.
create table public.user_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  player_id uuid unique references public.players(id) on delete set null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_accounts is
'Aplikācijas ielogošanās konts un tā lomas. player_id ir tukšs administratoriem un citiem lietotājiem, kuri nav turnīru spēlētāji.';

comment on column public.user_accounts.player_id is
'Esošais turnīra spēlētāja profils, kuram piesaistīts šis ielogošanās konts.';

-- Esošajiem kontiem players.id pašlaik sakrīt ar auth.users.id.
-- Pārnesam šo saiti jaunajā modelī, nezaudējot nevienu profilu vai lomu.
insert into public.user_accounts (
  user_id,
  player_id,
  is_admin
)
select
  auth_user.id,
  player.id,
  coalesce(player.is_admin, false)
from auth.users auth_user
left join public.players player
  on player.id = auth_user.id
on conflict (user_id) do update
set
  player_id = excluded.player_id,
  is_admin = excluded.is_admin,
  updated_at = now();

alter table public.user_accounts enable row level security;

revoke all on table public.user_accounts from anon, authenticated;
grant select on table public.user_accounts to authenticated;

create or replace function public.current_player_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select account.player_id
  from public.user_accounts account
  where account.user_id = (select auth.uid())
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select account.is_admin
    from public.user_accounts account
    where account.user_id = (select auth.uid())
    limit 1
  ), false);
$$;

revoke all on function public.current_player_id() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.current_player_id() to authenticated;
grant execute on function public.is_admin() to authenticated;

create policy "Users can view their own account"
on public.user_accounts
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can view user accounts"
on public.user_accounts
for select
to authenticated
using ((select public.is_admin()));

-- Jauns Auth lietotājs vienmēr saņem konta ierakstu. Pašreizējais
-- profila izveides trigeris pagaidām paliek spēkā atpakaļsaderībai;
-- uzaicinājumu posmā to aizstāsim ar profila piesaistes procesu.
create or replace function public.ensure_user_account()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_account_created on auth.users;

create trigger on_auth_user_account_created
after insert on auth.users
for each row
execute function public.ensure_user_account();
