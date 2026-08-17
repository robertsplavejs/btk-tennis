-- Izveido players profilu esošajiem Auth lietotājiem.
insert into public.players (
  id,
  club_id,
  full_name,
  initials,
  is_admin
)
select
  auth_user.id,
  club.id,
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
    split_part(auth_user.email, '@', 1)
  ),
  upper(
    left(
      coalesce(
        nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
        split_part(auth_user.email, '@', 1)
      ),
      2
    )
  ),
  false
from auth.users auth_user
cross join public.clubs club
where club.slug = 'btk'
on conflict (id) do update
set
  club_id = excluded.club_id,
  updated_at = now();

-- Pirmo izveidoto Auth lietotāju padara par sākotnējo administratoru.
update public.players
set
  is_admin = true,
  updated_at = now()
where id = (
  select id
  from auth.users
  order by created_at asc
  limit 1
);