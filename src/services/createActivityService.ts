import { createClient } from "@/lib/supabase/server";
import { ActivityRepository } from "@/repositories/ActivityRepository";
import { ActivityService } from "@/services/ActivityService";

export async function createActivityService() {
  const supabase = await createClient();

  const activityRepository =
    new ActivityRepository(supabase);

  return new ActivityService(activityRepository);
}