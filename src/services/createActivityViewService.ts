import { createActivityService } from "@/services/createActivityService";
import { ActivityViewService } from "@/services/ActivityViewService";

export async function createActivityViewService() {
  const activityService =
    await createActivityService();

  return new ActivityViewService(activityService);
}