alter table public.matches
add column result_type text not null default 'regular';

alter table public.matches
add constraint matches_result_type_check
check (
  result_type in (
    'regular',
    'walkover',
    'retired'
  )
);

create index matches_result_type_idx
on public.matches(result_type);