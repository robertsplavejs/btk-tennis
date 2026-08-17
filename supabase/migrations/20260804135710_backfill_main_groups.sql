-- Izveido galveno tehnisko grupu visiem turnīriem,
-- kuriem tā vēl nav izveidota.

insert into public.groups (
  tournament_id,
  name,
  slug
)
select
  tournament.id,
  tournament.name,
  'main'
from public.tournaments tournament
where not exists (
  select 1
  from public.groups existing_group
  where existing_group.tournament_id = tournament.id
    and existing_group.slug = 'main'
)
on conflict (tournament_id, slug) do nothing;