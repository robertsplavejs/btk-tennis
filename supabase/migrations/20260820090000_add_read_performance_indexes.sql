create index if not exists matches_tournament_id_idx
  on public.matches (tournament_id);

create index if not exists groups_tournament_slug_idx
  on public.groups (tournament_id, slug);

create index if not exists group_players_group_status_joined_idx
  on public.group_players (group_id, status, joined_at);
