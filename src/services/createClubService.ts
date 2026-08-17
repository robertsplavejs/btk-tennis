import { ClubRepository } from "@/repositories/ClubRepository";
import { ClubService } from "@/services/ClubService";
import { createClient } from "@/lib/supabase/server";

export async function createClubService() {
  const supabase = await createClient();
  const clubRepository = new ClubRepository(supabase);

  return new ClubService(clubRepository);
}