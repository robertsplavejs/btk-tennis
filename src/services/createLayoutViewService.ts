import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createNotificationService } from "@/services/createNotificationService";
import {
  LayoutViewService,
  type LayoutCurrentUser,
} from "@/services/LayoutViewService";

export async function createLayoutViewService() {
  const identity = await getCurrentIdentity();

  let currentUser: LayoutCurrentUser | null = null;

  if (identity) {
    currentUser = {
      userId: identity.userId,
      playerId: identity.playerId,
      fullName: identity.fullName,
      avatarUrl: identity.avatarUrl,
      isAdmin: identity.isAdmin,
    };
  }

  const notificationService =
    await createNotificationService();

  return {
    service: new LayoutViewService(notificationService),
    currentUser,
  };
}
