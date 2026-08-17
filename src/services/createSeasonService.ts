import { createClient } from "@/lib/supabase/server";
import { SeasonRepository } from "@/repositories/SeasonRepository";
import { SeasonService } from "@/services/SeasonService";

export async function createSeasonService() {
  const supabase = await createClient();
  const seasonRepository = new SeasonRepository(supabase);

  return new SeasonService(seasonRepository);
}