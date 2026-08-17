import { createClient } from "@/lib/supabase/server";
import { MatchHistoryRepository } from "@/repositories/MatchHistoryRepository";
import { MatchHistoryService } from "@/services/MatchHistoryService";

export async function createMatchHistoryService() {
  const supabase = await createClient();

  const matchHistoryRepository =
    new MatchHistoryRepository(supabase);

  return new MatchHistoryService(
    matchHistoryRepository
  );
}