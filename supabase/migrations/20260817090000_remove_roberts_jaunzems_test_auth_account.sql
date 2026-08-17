-- Remove the temporary login used to test the Roberts Jaunzems-Petersons
-- player-account claim flow. The player, matches, and tournament data remain.
delete from auth.users
where id = '5dd530fe-70c1-490c-a822-5f70d3ed9c91'::uuid
  and lower(email) = 'roberts@entuziasti.lv';
