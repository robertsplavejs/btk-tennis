create extension if not exists "pgcrypto";

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete set null,
  full_name text not null,
  initials text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null,
  starts_on date,
  ends_on date,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.seasons(id) on delete cascade,
  name text not null,
  slug text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'completed', 'archived')),
  qualification_places integer,
  points_for_win integer not null default 3,
  points_for_loss integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, slug)
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tournament_id, slug)
);

create table public.group_players (
  group_id uuid not null references public.groups(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  seed integer,
  joined_at timestamptz not null default now(),
  primary key (group_id, player_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  player_one_id uuid not null references public.players(id) on delete restrict,
  player_two_id uuid not null references public.players(id) on delete restrict,
  status text not null default 'unscheduled'
    check (status in ('unscheduled', 'scheduled', 'completed', 'cancelled')),
  scheduled_at timestamptz,
  court text,
  location text,
  winner_id uuid references public.players(id) on delete restrict,
  notes text,
  result_entered_by uuid references public.players(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (player_one_id <> player_two_id),
  check (
    winner_id is null
    or winner_id = player_one_id
    or winner_id = player_two_id
  )
);

create table public.match_sets (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  set_number integer not null check (set_number between 1 and 5),
  set_type text not null default 'regular'
    check (set_type in ('regular', 'match_tiebreak')),
  player_one_score integer not null check (player_one_score >= 0),
  player_two_score integer not null check (player_two_score >= 0),
  player_one_tiebreak_points integer,
  player_two_tiebreak_points integer,
  created_at timestamptz not null default now(),
  unique (match_id, set_number)
);

create index matches_group_id_idx on public.matches(group_id);
create index matches_player_one_id_idx on public.matches(player_one_id);
create index matches_player_two_id_idx on public.matches(player_two_id);
create index matches_scheduled_at_idx on public.matches(scheduled_at);
create index match_sets_match_id_idx on public.match_sets(match_id);