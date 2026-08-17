create or replace function public.protect_match_identity_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.tournament_id is distinct from old.tournament_id
    or new.group_id is distinct from old.group_id
    or new.player_one_id is distinct from old.player_one_id
    or new.player_two_id is distinct from old.player_two_id
    or new.round_number is distinct from old.round_number
    or new.match_number is distinct from old.match_number then
    raise exception 'Spēles dalībniekus un turnīra sasaisti drīkst mainīt tikai administrators.';
  end if;

  return new;
end;
$$;

revoke all on function public.protect_match_identity_fields() from public;

drop trigger if exists protect_match_identity_fields_trigger
on public.matches;

create trigger protect_match_identity_fields_trigger
before update on public.matches
for each row
execute function public.protect_match_identity_fields();

comment on function public.protect_match_identity_fields() is
'Neļauj spēles dalībniekam ar tiešu API pieprasījumu mainīt spēles identitāti, dalībniekus vai turnīra sasaisti.';
