import { NotificationEngine } from "@/core/notifications/NotificationEngine";
import { NotificationFactory } from "@/core/notifications/NotificationFactory";
import { createClient } from "@/lib/supabase/server";
import { NotificationRepository } from "@/repositories/NotificationRepository";

export async function createNotificationEngine() {
  const supabase = await createClient();

  const notificationRepository =
    new NotificationRepository(supabase);

  const notificationFactory =
    new NotificationFactory();

  return new NotificationEngine(
    notificationRepository,
    notificationFactory
  );
}