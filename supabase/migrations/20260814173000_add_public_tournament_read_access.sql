-- Publiskajam apmeklētāja režīmam atver tikai aktīvu un pabeigtu
-- turnīru apskatei nepieciešamos datus. Rakstīšanas tiesības netiek mainītas.
grant select on table public.seasons to anon;
grant select on table public.tournaments to anon;
grant select on table public.groups to anon;
grant select on table public.group_players to anon;
grant select on table public.players to anon;
grant select on table public.matches to anon;
grant select on table public.match_sets to anon;

create policy "Public can view published tournament seasons"
on public.seasons for select to anon
using (
  exists (
    select 1 from public.tournaments
    where tournaments.season_id = seasons.id
      and tournaments.status in ('active', 'completed')
  )
);

create policy "Public can view published tournaments"
on public.tournaments for select to anon
using (status in ('active', 'completed'));

create policy "Public can view published tournament groups"
on public.groups for select to anon
using (
  exists (
    select 1 from public.tournaments
    where tournaments.id = groups.tournament_id
      and tournaments.status in ('active', 'completed')
  )
);

create policy "Public can view published tournament memberships"
on public.group_players for select to anon
using (
  exists (
    select 1
    from public.groups
    join public.tournaments on tournaments.id = groups.tournament_id
    where groups.id = group_players.group_id
      and tournaments.status in ('active', 'completed')
  )
);

create policy "Public can view published tournament players"
on public.players for select to anon
using (
  exists (
    select 1
    from public.group_players
    join public.groups on groups.id = group_players.group_id
    join public.tournaments on tournaments.id = groups.tournament_id
    where group_players.player_id = players.id
      and group_players.status = 'active'
      and tournaments.status in ('active', 'completed')
  )
);

create policy "Public can view published tournament matches"
on public.matches for select to anon
using (
  exists (
    select 1 from public.tournaments
    where tournaments.id = matches.tournament_id
      and tournaments.status in ('active', 'completed')
  )
);

create policy "Public can view published tournament match sets"
on public.match_sets for select to anon
using (
  exists (
    select 1
    from public.matches
    join public.tournaments on tournaments.id = matches.tournament_id
    where matches.id = match_sets.match_id
      and tournaments.status in ('active', 'completed')
  )
);
