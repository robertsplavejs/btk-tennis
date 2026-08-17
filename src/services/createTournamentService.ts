import { createClient } from "@/lib/supabase/server";
import { GroupRepository } from "@/repositories/GroupRepository";
import { TournamentRepository } from "@/repositories/TournamentRepository";
import { TournamentService } from "@/services/TournamentService";

export async function createTournamentService() {
  const supabase = await createClient();

  const tournamentRepository =
    new TournamentRepository(supabase);

  const groupRepository =
    new GroupRepository(supabase);

  return new TournamentService(
    tournamentRepository,
    groupRepository
  );
}