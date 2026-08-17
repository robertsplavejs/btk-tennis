create schema if not exists private;

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
    exists (
      select 1
      from public.players
      where players.id = auth.uid()
        and players.is_admin = true
    )
    or exists (
      select 1
      from public.matches
      where matches.id = target_match_id
        and (
          matches.player_one_id = auth.uid()
          or matches.player_two_id = auth.uid()
        )
    );
$$;

revoke all
on function private.can_access_match_history(uuid)
from public;

grant execute
on function private.can_access_match_history(uuid)
to authenticated;

drop policy if exists "Authorized users can view match history"
on public.match_history;

drop policy if exists "Authorized users can create match history"
on public.match_history;

create policy "Authorized users can view match history"
on public.match_history
for select
to authenticated
using (
  private.can_access_match_history(match_id)
);

create policy "Authorized users can create match history"
on public.match_history
for insert
to authenticated
with check (
  user_id = auth.uid()
  and private.can_access_match_history(match_id)
);