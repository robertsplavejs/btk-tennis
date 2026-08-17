create table public.account_invitations (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique default gen_random_uuid(),
  email text not null,
  display_name text not null,
  player_id uuid references public.players(id) on delete cascade,
  is_admin boolean not null default false,
  invited_by uuid not null references public.user_accounts(user_id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  accepted_by uuid references public.user_accounts(user_id),
  created_at timestamptz not null default now(),
  constraint account_invitations_email_not_blank
    check (length(trim(email)) > 3),
  constraint account_invitations_name_not_blank
    check (length(trim(display_name)) > 1)
);

create unique index account_invitations_pending_email_unique
on public.account_invitations (lower(email))
where accepted_at is null;

create unique index account_invitations_pending_player_unique
on public.account_invitations (player_id)
where accepted_at is null and player_id is not null;

alter table public.account_invitations enable row level security;

revoke all on table public.account_invitations from anon, authenticated;
grant select, insert, update, delete on table public.account_invitations
to authenticated;

create policy "Admins can manage account invitations"
on public.account_invitations
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create or replace function public.create_account_invitation(
  invitation_email text,
  invitation_player_id uuid default null,
  invitation_is_admin boolean default false,
  invitation_display_name text default null
)
returns table (token uuid, expires_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text;
  resolved_name text;
begin
  if not public.is_admin() then
    raise exception 'Šo darbību drīkst veikt tikai administrators.';
  end if;

  normalized_email := lower(trim(invitation_email));

  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Ievadi derīgu e-pasta adresi.';
  end if;

  if exists (
    select 1
    from auth.users auth_user
    where lower(auth_user.email) = normalized_email
  ) then
    raise exception 'Konts ar šo e-pasta adresi jau pastāv.';
  end if;

  if invitation_player_id is not null then
    select player.full_name
    into resolved_name
    from public.players player
    where player.id = invitation_player_id;

    if resolved_name is null then
      raise exception 'Spēlētāja profils nav atrasts.';
    end if;

    if exists (
      select 1
      from public.user_accounts account
      where account.player_id = invitation_player_id
    ) then
      raise exception 'Šim spēlētāja profilam jau ir piesaistīts konts.';
    end if;
  else
    resolved_name := nullif(trim(invitation_display_name), '');

    if resolved_name is null then
      raise exception 'Administratoram bez spēlētāja profila jānorāda vārds.';
    end if;
  end if;

  delete from public.account_invitations invitation
  where invitation.accepted_at is null
    and (
      lower(invitation.email) = normalized_email
      or (
        invitation_player_id is not null
        and invitation.player_id = invitation_player_id
      )
    );

  return query
  insert into public.account_invitations (
    email,
    display_name,
    player_id,
    is_admin,
    invited_by
  )
  values (
    normalized_email,
    resolved_name,
    invitation_player_id,
    invitation_is_admin,
    (select auth.uid())
  )
  returning account_invitations.token, account_invitations.expires_at;
end;
$$;

revoke all on function public.create_account_invitation(text, uuid, boolean, text)
from public;
grant execute on function public.create_account_invitation(text, uuid, boolean, text)
to authenticated;

create or replace function public.get_account_invitation_preview(
  invitation_token uuid
)
returns table (
  display_name text,
  is_admin boolean,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    invitation.display_name,
    invitation.is_admin,
    invitation.expires_at
  from public.account_invitations invitation
  where invitation.token = invitation_token
    and invitation.accepted_at is null
    and invitation.expires_at > now()
  limit 1;
$$;

revoke all on function public.get_account_invitation_preview(uuid) from public;
grant execute on function public.get_account_invitation_preview(uuid)
to anon, authenticated;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.account_invitations%rowtype;
  invitation_token uuid;
begin
  begin
    invitation_token := nullif(
      trim(new.raw_user_meta_data ->> 'invitation_token'),
      ''
    )::uuid;
  exception when invalid_text_representation then
    raise exception 'Uzaicinājuma saite nav derīga.';
  end;

  if invitation_token is null then
    raise exception 'Reģistrācijai nepieciešams derīgs uzaicinājums.';
  end if;

  select candidate.*
  into invitation
  from public.account_invitations candidate
  where candidate.token = invitation_token
    and candidate.accepted_at is null
    and candidate.expires_at > now()
    and lower(candidate.email) = lower(new.email)
  for update;

  if invitation.id is null then
    raise exception 'Uzaicinājums nav derīgs, ir beidzies vai e-pasts nesakrīt.';
  end if;

  insert into public.user_accounts (
    user_id,
    player_id,
    is_admin
  )
  values (
    new.id,
    invitation.player_id,
    invitation.is_admin
  )
  on conflict (user_id) do update
  set
    player_id = excluded.player_id,
    is_admin = excluded.is_admin,
    updated_at = now();

  update public.account_invitations
  set
    accepted_at = now(),
    accepted_by = new.id
  where id = invitation.id;

  return new;
end;
$$;

-- Atvērtā reģistrācija vairs nerada jaunu spēlētāja profilu. Trigeris
-- tagad tikai sasaista uzaicināto kontu ar administratora izvēlēto profilu.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();
