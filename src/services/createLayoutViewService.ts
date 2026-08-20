import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
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

  return {
    service: new LayoutViewService(),
    currentUser,
  };
}
