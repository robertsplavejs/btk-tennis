insert into public.clubs (
  name,
  slug
)
values (
  'Bīriņa tenisa klubs',
  'btk'
)
on conflict (slug) do update
set
  name = excluded.name,
  updated_at = now();