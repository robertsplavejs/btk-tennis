-- =========================================================
-- BTK Tennis — spēlētāju grupu dalības vēsture
-- =========================================================

-- Esošā group_players tabula sākotnēji izmantoja:
-- primary key (group_id, player_id)
--
-- Tas neļautu vienam spēlētājam nākotnē atkārtoti nonākt tajā
-- pašā grupā. Tāpēc katrai dalībai piešķiram atsevišķu ID.

alter table public.group_players
drop constraint if exists group_players_pkey;

alter table public.group_players
add column if not exists id uuid default gen_random_uuid();

update public.group_players
set id = gen_random_uuid()
where id is null;

alter table public.group_players
alter column id set not null;

alter table public.group_players
add constraint group_players_pkey primary key (id);


-- ---------------------------------------------------------
-- Dalības statuss un periods
-- ---------------------------------------------------------

alter table public.group_players
add column if not exists left_at timestamptz;

alter table public.group_players
add column if not exists status text not null default 'active';

alter table public.group_players
add column if not exists promoted_from_group_id uuid
references public.groups(id)
on delete set null;

alter table public.group_players
add column if not exists moved_by uuid
references public.players(id)
on delete set null;

alter table public.group_players
add column if not exists change_reason text;

alter table public.group_players
add column if not exists updated_at timestamptz not null default now();


-- ---------------------------------------------------------
-- Atļautie dalības statusi
-- ---------------------------------------------------------

alter table public.group_players
drop constraint if exists group_players_status_check;

alter table public.group_players
add constraint group_players_status_check
check (
  status in (
    'active',
    'promoted',
    'relegated',
    'withdrawn',
    'removed',
    'completed'
  )
);


-- ---------------------------------------------------------
-- Dalības datumu pārbaude
-- ---------------------------------------------------------

alter table public.group_players
drop constraint if exists group_players_membership_dates_check;

alter table public.group_players
add constraint group_players_membership_dates_check
check (
  left_at is null
  or left_at >= joined_at
);


-- ---------------------------------------------------------
-- Aktīvai dalībai left_at jābūt tukšam.
-- Pabeigtai dalībai left_at jābūt norādītam.
-- ---------------------------------------------------------

alter table public.group_players
drop constraint if exists group_players_status_dates_check;

alter table public.group_players
add constraint group_players_status_dates_check
check (
  (
    status = 'active'
    and left_at is null
  )
  or
  (
    status <> 'active'
    and left_at is not null
  )
);


-- ---------------------------------------------------------
-- Vienam spēlētājam vienā grupā vienlaikus drīkst būt
-- tikai viena aktīva dalība.
-- ---------------------------------------------------------

create unique index if not exists
group_players_one_active_membership_per_group_idx
on public.group_players (group_id, player_id)
where status = 'active';


-- ---------------------------------------------------------
-- Vienā turnīrā spēlētājs vienlaikus drīkst atrasties
-- tikai vienā grupā.
--
-- Piemēram, spēlētājs nevar vienlaikus būt gan
-- "Vīrieši B", gan "Vīrieši A" tajā pašā turnīrā.
-- ---------------------------------------------------------

create or replace function public.validate_active_group_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_tournament_id uuid;
begin
  if new.status <> 'active' then
    return new;
  end if;

  select tournament_id
  into target_tournament_id
  from public.groups
  where id = new.group_id;

  if target_tournament_id is null then
    raise exception 'Norādītā grupa neeksistē.';
  end if;

  if exists (
    select 1
    from public.group_players existing_membership
    join public.groups existing_group
      on existing_group.id = existing_membership.group_id
    where existing_membership.player_id = new.player_id
      and existing_membership.status = 'active'
      and existing_group.tournament_id = target_tournament_id
      and existing_membership.id <> new.id
  ) then
    raise exception
      'Spēlētājam šajā turnīrā jau ir aktīva dalība citā grupā.';
  end if;

  return new;
end;
$$;

drop trigger if exists
validate_active_group_membership_trigger
on public.group_players;

create trigger validate_active_group_membership_trigger
before insert or update
on public.group_players
for each row
execute function public.validate_active_group_membership();


-- ---------------------------------------------------------
-- Indeksi biežākajiem vaicājumiem
-- ---------------------------------------------------------

create index if not exists
group_players_player_id_idx
on public.group_players (player_id);

create index if not exists
group_players_group_id_idx
on public.group_players (group_id);

create index if not exists
group_players_status_idx
on public.group_players (status);

create index if not exists
group_players_joined_at_idx
on public.group_players (joined_at);

create index if not exists
group_players_promoted_from_group_id_idx
on public.group_players (promoted_from_group_id);


-- ---------------------------------------------------------
-- Komentāri datubāzes dokumentācijai
-- ---------------------------------------------------------

comment on column public.group_players.joined_at is
'Datums un laiks, kad spēlētāja dalība grupā sākās.';

comment on column public.group_players.left_at is
'Datums un laiks, kad spēlētāja dalība grupā beidzās.';

comment on column public.group_players.status is
'Dalības statuss: active, promoted, relegated, withdrawn, removed vai completed.';

comment on column public.group_players.promoted_from_group_id is
'Grupa, no kuras spēlētājs tika pārcelts uz pašreizējo grupu.';

comment on column public.group_players.moved_by is
'Administrators vai cita pilnvarota persona, kas veica grupas maiņu.';

comment on column public.group_players.change_reason is
'Brīvas formas paskaidrojums par grupas maiņas iemeslu.';