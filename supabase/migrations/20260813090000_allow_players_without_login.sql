-- Spēlētāja profils ir turnīra dalībnieks, ne obligāti aplikācijas lietotājs.
-- Esošajiem lietotājiem players.id joprojām sakrīt ar auth.users.id, tāpēc
-- pašreizējā autentifikācijas un RLS uzvedība paliek atpakaļsaderīga.
alter table public.players
drop constraint if exists players_id_fkey;

comment on column public.players.id is
'Spēlētāja profila ID. Login lietotājiem tas sakrīt ar auth.users.id; vēsturiskajiem un neaicinātajiem spēlētājiem auth.users ieraksts nav nepieciešams.';
