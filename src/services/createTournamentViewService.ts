import { createClient } from "@/lib/supabase/server";
import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import { TournamentRepository } from "@/repositories/TournamentRepository";
import { TournamentViewService } from "@/services/TournamentViewService";

export async function createTournamentViewService() {
  const supabase = await createClient();

  const tournamentRepository =
    new TournamentRepository(supabase);

  const participantRepository =
    new ParticipantRepository(supabase);

  const matchRepository =
    new MatchRepository(supabase);

  return new TournamentViewService(
    tournamentRepository,
    participantRepository,
    matchRepository
  );
}