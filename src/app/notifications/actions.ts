"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createNotificationService } from "@/services/createNotificationService";

function revalidateNotificationViews() {
  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}

export async function markNotificationAsRead(
  notificationId: string
) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.playerId) {
    redirect(identity.isAdmin ? "/admin" : "/");
  }

  const notificationService =
    await createNotificationService();

  const notification = await notificationService.markAsRead(
    notificationId,
    identity.playerId
  );

  revalidateNotificationViews();

  if (notification?.link?.startsWith("/")) {
    redirect(notification.link);
  }

  redirect("/notifications");
}

export async function markAllNotificationsAsRead() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.playerId) {
    redirect(identity.isAdmin ? "/admin" : "/");
  }

  const notificationService =
    await createNotificationService();

  await notificationService.markAllAsRead(identity.playerId);

  revalidateNotificationViews();

  redirect("/notifications");
}
