-- =====================================================
-- RETIRED (RET) SUPPORT
-- =====================================================

alter table public.matches
    alter column result_type
    set default 'regular';

comment on column public.matches.result_type is
'regular | walkover | retired | cancelled';


create index if not exists idx_matches_result_type
    on public.matches(result_type);