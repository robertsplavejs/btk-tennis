-- Restrict notification and activity creation to the referenced match context.
-- The application still creates human-readable copy, while the database verifies
-- that the actor, recipient, event type and referenced records belong together.

revoke insert, update, delete
on table public.notifications
from authenticated;

grant update (is_read, read_at)
on table public.notifications
to authenticated;

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
  current_user_id uuid := (select auth.uid());
  created_notification_id uuid;
  referenced_match public.matches%rowtype;
  actor_is_admin boolean := coalesce((select public.is_admin()), false);
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if nullif(btrim(notification_title), '') is null
     or nullif(btrim(notification_body), '') is null then
    raise exception 'Notification content is required';
  end if;

  if notification_type in (
    'match_scheduled',
    'match_rescheduled',
    'result_created',
    'result_updated',
    'walkover',
    'retired'
  ) then
    if target_match_id is null then
      raise exception 'Match notification requires a match';
    end if;

    select * into referenced_match
    from public.matches
    where id = target_match_id;

    if not found then
      raise exception 'Referenced match not found';
    end if;

    if target_tournament_id is distinct from referenced_match.tournament_id then
      raise exception 'Tournament does not match the referenced match';
    end if;

    if not actor_is_admin
       and current_user_id <> referenced_match.player_one_id
       and current_user_id <> referenced_match.player_two_id then
      raise exception 'Not allowed to create events for this match';
    end if;

    if target_user_id <> referenced_match.player_one_id
       and target_user_id <> referenced_match.player_two_id then
      raise exception 'Recipient is not a participant of the referenced match';
    end if;

    if target_user_id = current_user_id then
      raise exception 'Match notifications cannot target the actor';
    end if;

    if notification_type in ('match_scheduled', 'match_rescheduled')
       and referenced_match.status <> 'scheduled' then
      raise exception 'Schedule notification does not match the match status';
    end if;

    if notification_type in ('result_created', 'result_updated')
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'regular') then
      raise exception 'Result notification does not match the match result';
    end if;

    if notification_type = 'walkover'
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'walkover') then
      raise exception 'Walkover notification does not match the match result';
    end if;

    if notification_type = 'retired'
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'retired') then
      raise exception 'Retirement notification does not match the match result';
    end if;

    notification_link := '/matches/' || target_match_id::text;
  elsif notification_type in (
    'tournament_created',
    'tournament_started',
    'system'
  ) then
    if not actor_is_admin then
      raise exception 'Only administrators can create tournament or system notifications';
    end if;
  else
    raise exception 'Unsupported notification type';
  end if;

  if not exists (
    select 1 from public.players where id = target_user_id
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
  ) values (
    target_user_id,
    current_user_id,
    target_tournament_id,
    target_match_id,
    notification_type,
    btrim(notification_title),
    btrim(notification_body),
    notification_link
  )
  returning id into created_notification_id;

  return created_notification_id;
end;
$$;

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
  current_user_id uuid := (select auth.uid());
  created_activity_id uuid;
  referenced_match public.matches%rowtype;
  actor_is_admin boolean := coalesce((select public.is_admin()), false);
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if nullif(btrim(target_title), '') is null
     or nullif(btrim(target_description), '') is null then
    raise exception 'Activity content is required';
  end if;

  if target_color not in (
    'green', 'blue', 'orange', 'purple', 'red', 'gray'
  ) then
    raise exception 'Unsupported activity color';
  end if;

  if target_activity_type in (
    'match_result',
    'match_updated',
    'match_scheduled',
    'match_rescheduled',
    'walkover',
    'retired'
  ) then
    if target_match_id is null then
      raise exception 'Match activity requires a match';
    end if;

    select * into referenced_match
    from public.matches
    where id = target_match_id;

    if not found then
      raise exception 'Referenced match not found';
    end if;

    if target_tournament_id is distinct from referenced_match.tournament_id then
      raise exception 'Tournament does not match the referenced match';
    end if;

    if not actor_is_admin
       and current_user_id <> referenced_match.player_one_id
       and current_user_id <> referenced_match.player_two_id then
      raise exception 'Not allowed to create events for this match';
    end if;

    if target_activity_type in ('match_scheduled', 'match_rescheduled')
       and referenced_match.status <> 'scheduled' then
      raise exception 'Schedule activity does not match the match status';
    end if;

    if target_activity_type in ('match_result', 'match_updated')
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'regular') then
      raise exception 'Result activity does not match the match result';
    end if;

    if target_activity_type = 'walkover'
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'walkover') then
      raise exception 'Walkover activity does not match the match result';
    end if;

    if target_activity_type = 'retired'
       and (referenced_match.status <> 'completed'
            or referenced_match.result_type <> 'retired') then
      raise exception 'Retirement activity does not match the match result';
    end if;
  elsif target_activity_type in (
    'player_joined',
    'tournament_started',
    'tournament_finished',
    'match_card',
    'system'
  ) then
    if not actor_is_admin then
      raise exception 'Only administrators can create this activity type';
    end if;
  else
    raise exception 'Unsupported activity type';
  end if;

  if not exists (
    select 1 from public.players where id = current_user_id
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
  ) values (
    target_tournament_id,
    target_match_id,
    current_user_id,
    target_activity_type,
    btrim(target_title),
    btrim(target_description),
    target_icon,
    target_color,
    coalesce(target_metadata, '{}'::jsonb)
  )
  returning id into created_activity_id;

  return created_activity_id;
end;
$$;

revoke all
on function public.create_notification(uuid, text, text, text, text, uuid, uuid)
from public;

grant execute
on function public.create_notification(uuid, text, text, text, text, uuid, uuid)
to authenticated;

revoke all
on function public.create_activity(text, text, text, text, text, jsonb, uuid, uuid)
from public;

grant execute
on function public.create_activity(text, text, text, text, text, jsonb, uuid, uuid)
to authenticated;

-- The authenticated database role is shared by administrators and regular users.
-- Admin table grants therefore also expose columns to regular users at the SQL
-- privilege level. RLS limits rows, and this trigger protects privileged columns.
create or replace function public.protect_player_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce((select public.is_admin()), false) then
    return new;
  end if;

  if new.id is distinct from old.id
     or new.club_id is distinct from old.club_id
     or new.is_admin is distinct from old.is_admin
     or new.created_at is distinct from old.created_at then
    raise exception 'Only administrators can change privileged player fields';
  end if;

  return new;
end;
$$;

revoke all
on function public.protect_player_privileged_fields()
from public;

drop trigger if exists protect_player_privileged_fields_trigger
on public.players;

create trigger protect_player_privileged_fields_trigger
before update on public.players
for each row
execute function public.protect_player_privileged_fields();

comment on function public.protect_player_privileged_fields() is
'Prevents a regular user from changing is_admin, club ownership or player identity through the direct API.';
