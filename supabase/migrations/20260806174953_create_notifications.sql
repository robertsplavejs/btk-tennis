-- =========================================================
-- BTK Tennis — Notifications
-- =========================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.players(id)
    on delete cascade,

  actor_id uuid
    references public.players(id)
    on delete set null,

  tournament_id uuid
    references public.tournaments(id)
    on delete cascade,

  match_id uuid
    references public.matches(id)
    on delete cascade,

  type text not null
    check (
      type in (
        'match_scheduled',
        'match_rescheduled',
        'result_created',
        'result_updated',
        'walkover',
        'retired',
        'tournament_created',
        'tournament_started',
        'system'
      )
    ),

  title text not null,
  body text not null,

  link text,

  is_read boolean not null default false,
  read_at timestamptz,

  created_at timestamptz not null default now(),

  check (
    (is_read = false and read_at is null)
    or is_read = true
  )
);


-- =========================================================
-- Indeksi
-- =========================================================

create index notifications_user_created_at_idx
  on public.notifications(user_id, created_at desc);

create index notifications_user_unread_idx
  on public.notifications(user_id, is_read)
  where is_read = false;

create index notifications_match_id_idx
  on public.notifications(match_id);

create index notifications_tournament_id_idx
  on public.notifications(tournament_id);


-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.notifications
enable row level security;

revoke all
on table public.notifications
from anon, authenticated;

grant select
on table public.notifications
to authenticated;

grant update (
  is_read,
  read_at
)
on table public.notifications
to authenticated;

grant insert, update, delete
on table public.notifications
to authenticated;


-- Lietotājs redz tikai savus paziņojumus.

create policy "Users can view their own notifications"
on public.notifications
for select
to authenticated
using (
  user_id = (select auth.uid())
);


-- Lietotājs drīkst mainīt tikai savus paziņojumus.
-- Kolonnu privilēģijas ļauj mainīt tikai is_read un read_at.

create policy "Users can update their own notifications"
on public.notifications
for update
to authenticated
using (
  user_id = (select auth.uid())
)
with check (
  user_id = (select auth.uid())
);


-- Administrators drīkst pilnībā pārvaldīt paziņojumus.

create policy "Admins can manage notifications"
on public.notifications
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);


-- =========================================================
-- Droša paziņojuma izveides funkcija
-- =========================================================

create or replace function public.create_notification(
  target_user_id uuid,
  notification_type text,
  notification_title text,
  notification_body text,
  notification_link text default null,
  target_tournament_id uuid default null,
  target_match_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_notification_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  if notification_type not in (
    'match_scheduled',
    'match_rescheduled',
    'result_created',
    'result_updated',
    'walkover',
    'retired',
    'tournament_created',
    'tournament_started',
    'system'
  ) then
    raise exception 'Unsupported notification type';
  end if;

  if not exists (
    select 1
    from public.players
    where id = target_user_id
  ) then
    raise exception 'Notification recipient not found';
  end if;

  insert into public.notifications (
    user_id,
    actor_id,
    tournament_id,
    match_id,
    type,
    title,
    body,
    link
  )
  values (
    target_user_id,
    (select auth.uid()),
    target_tournament_id,
    target_match_id,
    notification_type,
    notification_title,
    notification_body,
    notification_link
  )
  returning id into created_notification_id;

  return created_notification_id;
end;
$$;

revoke all
on function public.create_notification(
  uuid,
  text,
  text,
  text,
  text,
  uuid,
  uuid
)
from public;

grant execute
on function public.create_notification(
  uuid,
  text,
  text,
  text,
  text,
  uuid,
  uuid
)
to authenticated;