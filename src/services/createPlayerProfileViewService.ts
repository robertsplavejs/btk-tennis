import { createClient } from "@/lib/supabase/server";
import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import { PlayerRepository } from "@/repositories/PlayerRepository";
import { TournamentRepository } from "@/repositories/TournamentRepository";
import { PlayerProfileViewService } from "@/services/PlayerProfileViewService";
import { TournamentViewService } from "@/services/TournamentViewService";

export async function createPlayerProfileViewService() {
  const supabase = await createClient();

  const playerRepository = new PlayerRepository(supabase);
  const tournamentRepository =
    new TournamentRepository(supabase);
  const participantRepository =
    new ParticipantRepository(supabase);
  const matchRepository = new MatchRepository(supabase);

  const tournamentViewService =
    new TournamentViewService(
      tournamentRepository,
      participantRepository,
      matchRepository
    );

  return new PlayerProfileViewService(
    playerRepository,
    tournamentViewService
  );
}