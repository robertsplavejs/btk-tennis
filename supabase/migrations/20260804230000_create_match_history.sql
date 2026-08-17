create table public.match_history (
  id uuid primary key default gen_random_uuid(),

  match_id uuid not null
    references public.matches(id)
    on delete cascade,

  user_id uuid
    references public.players(id)
    on delete set null,

  action text not null,

  old_value jsonb,

  new_value jsonb,

  created_at timestamptz not null default now()
);

create index match_history_match_id_idx
on public.match_history(match_id);

create index match_history_created_at_idx
on public.match_history(created_at desc);

alter table public.match_history
enable row level security;