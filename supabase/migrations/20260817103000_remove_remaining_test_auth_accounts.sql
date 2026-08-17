-- Remove the two remaining temporary login accounts used during V1 testing.
-- Player, match, and tournament records are stored separately and remain intact.
do $$
declare
  expected_accounts constant integer := 2;
  matched_accounts integer;
begin
  select count(*)
  into matched_accounts
  from auth.users auth_user
  where (
    auth_user.id = '6d43c951-254b-4c3b-8c5e-350213352a1e'::uuid
    and lower(auth_user.email) = 'janis@janis.lv'
  ) or (
    auth_user.id = '3a53d8c6-09b3-4e78-92dd-c18d189712f4'::uuid
    and lower(auth_user.email) = 'testplayer@btk.lv'
  );

  if matched_accounts <> expected_accounts then
    raise exception
      'Test account cleanup stopped: expected % exact account matches, found %.',
      expected_accounts,
      matched_accounts;
  end if;

  -- Deleting a login also clears its optional audit reference through the
  -- existing ON DELETE SET NULL constraints. Permit that metadata-only
  -- cleanup without changing any match result, score, or participant data.
  perform set_config('btk.validated_result_write', 'on', true);

  delete from auth.users auth_user
  where (
    auth_user.id = '6d43c951-254b-4c3b-8c5e-350213352a1e'::uuid
    and lower(auth_user.email) = 'janis@janis.lv'
  ) or (
    auth_user.id = '3a53d8c6-09b3-4e78-92dd-c18d189712f4'::uuid
    and lower(auth_user.email) = 'testplayer@btk.lv'
  );
end;
$$;
