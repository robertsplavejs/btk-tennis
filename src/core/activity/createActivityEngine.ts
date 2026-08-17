import { ActivityEngine } from "@/core/activity/ActivityEngine";
import { ActivityFactory } from "@/core/activity/ActivityFactory";
import { createClient } from "@/lib/supabase/server";
import { ActivityRepository } from "@/repositories/ActivityRepository";

export async function createActivityEngine() {
  const supabase = await createClient();

  const activityRepository =
    new ActivityRepository(supabase);

  const activityFactory = new ActivityFactory();

  return new ActivityEngine(
    activityRepository,
    activityFactory
  );
}