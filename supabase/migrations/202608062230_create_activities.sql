-- =========================================================
-- BTK Tennis — Activity Feed
-- =========================================================

create table public.activities (
  id uuid primary key default gen_random_uuid(),

  tournament_id uuid
    references public.tournaments(id)
    on delete cascade,

  match_id uuid
    references public.matches(id)
    on delete cascade,

  actor_player_id uuid
    references public.players(id)
    on delete set null,

  activity_type text not null
    check (
      activity_type in (
        'match_result',
        'match_updated',
        'match_scheduled',
        'match_rescheduled',
        'walkover',
        'retired',
        'player_joined',
        'tournament_started',
        'tournament_finished',
        'match_card',
        'system'
      )
    ),

  title text not null,
  description text not null,

  icon text not null default 'ℹ️',

  color text not null default 'gray'
    check (
      color in (
        'green',
        'blue',
        'orange',
        'purple',
        'red',
        'gray'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);


-- =========================================================
-- Indeksi
-- =========================================================

create index activities_created_at_idx
  on public.activities(created_at desc);

create index activities_tournament_created_at_idx
  on public.activities(tournament_id, created_at desc);

create index activities_match_id_idx
  on public.activities(match_id);

create index activities_actor_player_id_idx
  on public.activities(actor_player_id);


-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.activities
enable row level security;

revoke all
on table public.activities
from anon, authenticated;

grant select
on table public.activities
to authenticated;


-- Visi ielogotie lietotāji drīkst apskatīt kluba aktivitātes.

create policy "Authenticated users can view activities"
on public.activities
for select
to authenticated
using (true);


-- Administratori drīkst pilnībā pārvaldīt aktivitātes.

create policy "Admins can manage activities"
on public.activities
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);


-- =========================================================
-- Droša aktivitātes izveides funkcija
-- =========================================================

create or replace function public.create_activity(
  target_activity_type text,
  target_title text,
  target_description text,
  target_icon text default 'ℹ️',
  target_color text default 'gray',
  target_metadata jsonb default '{}'::jsonb,
  target_tournament_id uuid default null,
  target_match_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
  created_activity_id uuid;
begin
  current_user_id := (select auth.uid());

  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if target_activity_type not in (
    'match_result',
    'match_updated',
    'match_scheduled',
    'match_rescheduled',
    'walkover',
    'retired',
    'player_joined',
    'tournament_started',
    'tournament_finished',
    'match_card',
    'system'
  ) then
    raise exception 'Unsupported activity type';
  end if;

  if target_color not in (
    'green',
    'blue',
    'orange',
    'purple',
    'red',
    'gray'
  ) then
    raise exception 'Unsupported activity color';
  end if;

  if not exists (
    select 1
    from public.players
    where id = current_user_id
  ) then
    raise exception 'Activity actor not found';
  end if;

  insert into public.activities (
    tournament_id,
    match_id,
    actor_player_id,
    activity_type,
    title,
    description,
    icon,
    color,
    metadata
  )
  values (
    target_tournament_id,
    target_match_id,
    current_user_id,
    target_activity_type,
    target_title,
    target_description,
    target_icon,
    target_color,
    coalesce(target_metadata, '{}'::jsonb)
  )
  returning id into created_activity_id;

  return created_activity_id;
end;
$$;

revoke all
on function public.create_activity(
  text,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid
)
from public;

grant execute
on function public.create_activity(
  text,
  text,
  text,
  text,
  text,
  jsonb,
  uuid,
  uuid
)
to authenticated;