alter table public.matches
add column if not exists round_number integer not null default 1
check (round_number >= 1);

alter table public.matches
add column if not exists match_number integer;

create unique index if not exists
matches_tournament_match_number_unique_idx
on public.matches (tournament_id, match_number)
where match_number is not null;

create index if not exists
matches_tournament_round_number_idx
on public.matches (tournament_id, round_number);