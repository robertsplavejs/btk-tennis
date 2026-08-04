-- =========================================================
-- BTK Tennis — Row Level Security
-- =========================================================

-- ---------------------------------------------------------
-- Palīgfunkcijas
-- SECURITY DEFINER ļauj droši pārbaudīt administratora
-- statusu, neradot rekursiju players tabulas RLS politikās.
-- ---------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.players
    where id = (select auth.uid())
      and is_admin = true
  );
$$;

create or replace function public.is_match_participant(
  target_match_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.matches
    where id = target_match_id
      and (
        player_one_id = (select auth.uid())
        or player_two_id = (select auth.uid())
      )
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_match_participant(uuid) from public;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_match_participant(uuid) to authenticated;


-- ---------------------------------------------------------
-- Ieslēdzam RLS visām publiskajām BTK tabulām
-- ---------------------------------------------------------

alter table public.clubs enable row level security;
alter table public.players enable row level security;
alter table public.seasons enable row level security;
alter table public.tournaments enable row level security;
alter table public.groups enable row level security;
alter table public.group_players enable row level security;
alter table public.matches enable row level security;
alter table public.match_sets enable row level security;


-- ---------------------------------------------------------
-- Datubāzes privilēģijas
-- Anonīmiem lietotājiem nedodam piekļuvi.
-- Autorizētiem lietotājiem lasīšana tiek dota zemāk,
-- bet RLS politikas joprojām nosaka reālo piekļuvi.
-- ---------------------------------------------------------

revoke all on table public.clubs from anon, authenticated;
revoke all on table public.players from anon, authenticated;
revoke all on table public.seasons from anon, authenticated;
revoke all on table public.tournaments from anon, authenticated;
revoke all on table public.groups from anon, authenticated;
revoke all on table public.group_players from anon, authenticated;
revoke all on table public.matches from anon, authenticated;
revoke all on table public.match_sets from anon, authenticated;

grant select on table public.clubs to authenticated;
grant select on table public.players to authenticated;
grant select on table public.seasons to authenticated;
grant select on table public.tournaments to authenticated;
grant select on table public.groups to authenticated;
grant select on table public.group_players to authenticated;
grant select on table public.matches to authenticated;
grant select on table public.match_sets to authenticated;

-- Spēlētājs drīkst mainīt tikai sava profila laukus.
grant update (
  full_name,
  initials,
  avatar_url,
  updated_at
) on table public.players to authenticated;

-- Spēles dalībnieks nedrīkst nomainīt spēlētājus,
-- turnīru vai grupu, bet drīkst pārvaldīt spēles norisi.
grant update (
  status,
  scheduled_at,
  court,
  location,
  winner_id,
  notes,
  result_entered_by,
  updated_at
) on table public.matches to authenticated;

-- Setu rezultātus drīkst pārvaldīt tikai spēles dalībnieki
-- vai administratori, ko papildus kontrolē RLS.
grant insert, update, delete
on table public.match_sets
to authenticated;


-- =========================================================
-- LASĪŠANAS POLITIKAS
-- Autorizēti lietotāji redz BTK turnīra informāciju.
-- =========================================================

create policy "Authenticated users can view clubs"
on public.clubs
for select
to authenticated
using (true);

create policy "Authenticated users can view players"
on public.players
for select
to authenticated
using (true);

create policy "Authenticated users can view seasons"
on public.seasons
for select
to authenticated
using (true);

create policy "Authenticated users can view tournaments"
on public.tournaments
for select
to authenticated
using (true);

create policy "Authenticated users can view groups"
on public.groups
for select
to authenticated
using (true);

create policy "Authenticated users can view group players"
on public.group_players
for select
to authenticated
using (true);

create policy "Authenticated users can view matches"
on public.matches
for select
to authenticated
using (true);

create policy "Authenticated users can view match sets"
on public.match_sets
for select
to authenticated
using (true);


-- =========================================================
-- SPĒLĒTĀJA PROFILS
-- Lietotājs drīkst labot tikai savu profilu.
-- =========================================================

create policy "Players can update their own profile"
on public.players
for update
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);


-- =========================================================
-- SPĒLES
-- Spēles dalībnieks drīkst mainīt savas spēles atļautos
-- laukus. Kolonnu privilēģijas neļauj mainīt player_one_id,
-- player_two_id, tournament_id vai group_id.
-- =========================================================

create policy "Participants can update their own matches"
on public.matches
for update
to authenticated
using (
  player_one_id = (select auth.uid())
  or player_two_id = (select auth.uid())
)
with check (
  player_one_id = (select auth.uid())
  or player_two_id = (select auth.uid())
);


-- =========================================================
-- SPĒLES SETI
-- Rezultātu drīkst ievadīt, labot vai dzēst tikai konkrētās
-- spēles dalībnieks.
-- =========================================================

create policy "Participants can insert sets for their matches"
on public.match_sets
for insert
to authenticated
with check (
  (select public.is_match_participant(match_id))
);

create policy "Participants can update sets for their matches"
on public.match_sets
for update
to authenticated
using (
  (select public.is_match_participant(match_id))
)
with check (
  (select public.is_match_participant(match_id))
);

create policy "Participants can delete sets from their matches"
on public.match_sets
for delete
to authenticated
using (
  (select public.is_match_participant(match_id))
);


-- =========================================================
-- ADMINISTRATORA POLITIKAS
-- Administrators drīkst pārvaldīt visas BTK tabulas.
-- =========================================================

create policy "Admins can manage clubs"
on public.clubs
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage players"
on public.players
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage seasons"
on public.seasons
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage tournaments"
on public.tournaments
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage groups"
on public.groups
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage group players"
on public.group_players
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage matches"
on public.matches
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);

create policy "Admins can manage match sets"
on public.match_sets
for all
to authenticated
using (
  (select public.is_admin())
)
with check (
  (select public.is_admin())
);


-- Administratoriem nepieciešamas pilnas tabulu privilēģijas.
-- RLS joprojām pārbaudīs public.is_admin().
grant insert, update, delete on table public.clubs to authenticated;
grant insert, update, delete on table public.players to authenticated;
grant insert, update, delete on table public.seasons to authenticated;
grant insert, update, delete on table public.tournaments to authenticated;
grant insert, update, delete on table public.groups to authenticated;
grant insert, update, delete on table public.group_players to authenticated;
grant insert, update, delete on table public.matches to authenticated;