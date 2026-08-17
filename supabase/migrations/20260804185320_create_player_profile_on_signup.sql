create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_club_id uuid;
  submitted_full_name text;
  generated_initials text;
begin
  select id
  into target_club_id
  from public.clubs
  where slug = 'btk'
  limit 1;

  if target_club_id is null then
    raise exception 'BTK klubs nav atrasts';
  end if;

  submitted_full_name :=
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');

  if submitted_full_name is null then
    submitted_full_name :=
      coalesce(
        nullif(split_part(new.email, '@', 1), ''),
        'Jauns spēlētājs'
      );
  end if;

  select string_agg(
    upper(left(name_part, 1)),
    ''
    order by part_number
  )
  into generated_initials
  from (
    select
      name_part,
      part_number
    from unnest(
      regexp_split_to_array(submitted_full_name, '\s+')
    ) with ordinality as name_parts(
      name_part,
      part_number
    )
    where name_part <> ''
    order by part_number
    limit 2
  ) initials_source;

  insert into public.players (
    id,
    club_id,
    full_name,
    initials,
    is_admin
  )
  values (
    new.id,
    target_club_id,
    submitted_full_name,
    nullif(generated_initials, ''),
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists
on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();