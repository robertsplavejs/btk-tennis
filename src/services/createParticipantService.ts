import { createClient } from "@/lib/supabase/server";
import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import { ParticipantService } from "@/services/ParticipantService";

export async function createParticipantService() {
  const supabase = await createClient();

  const participantRepository =
    new ParticipantRepository(supabase);

  const matchRepository =
    new MatchRepository(supabase);

  return new ParticipantService(
    participantRepository,
    matchRepository
  );
}