import { createClient } from "@/lib/supabase/server";
import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import { MatchService } from "@/services/MatchService";

export async function createMatchService() {
  const supabase = await createClient();

  const matchRepository = new MatchRepository(supabase);
  const participantRepository =
    new ParticipantRepository(supabase);

  return new MatchService(
    matchRepository,
    participantRepository
  );
}