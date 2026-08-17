import { createClient } from "@/lib/supabase/server";

import { PlayerRepository } from "@/repositories/PlayerRepository";
import { PlayerService } from "@/services/PlayerService";

export async function createPlayerService() {
  const supabase = await createClient();

  const playerRepository = new PlayerRepository(supabase);

  return new PlayerService(playerRepository);
}