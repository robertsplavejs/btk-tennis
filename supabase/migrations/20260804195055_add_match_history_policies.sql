drop policy if exists "Authorized users can view match history"
on public.match_history;

drop policy if exists "Authorized users can create match history"
on public.match_history;

create policy "Authorized users can view match history"
on public.match_history
for select
to authenticated
using (
  exists (
    select 1
    from public.players
    where players.id = auth.uid()
      and players.is_admin = true
  )
  or exists (
    select 1
    from public.matches
    where matches.id = match_history.match_id
      and (
        matches.player_one_id = auth.uid()
        or matches.player_two_id = auth.uid()
      )
  )
);

create policy "Authorized users can create match history"
on public.match_history
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    exists (
      select 1
      from public.players
      where players.id = auth.uid()
        and players.is_admin = true
    )
    or exists (
      select 1
      from public.matches
      where matches.id = match_history.match_id
        and (
          matches.player_one_id = auth.uid()
          or matches.player_two_id = auth.uid()
        )
    )
  )
);