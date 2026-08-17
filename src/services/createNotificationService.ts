import { createClient } from "@/lib/supabase/server";
import { NotificationRepository } from "@/repositories/NotificationRepository";
import { NotificationService } from "@/services/NotificationService";

export async function createNotificationService() {
  const supabase = await createClient();

  const notificationRepository =
    new NotificationRepository(supabase);

  return new NotificationService(
    notificationRepository
  );
}