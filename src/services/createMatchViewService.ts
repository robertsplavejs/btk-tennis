import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchService } from "@/services/createMatchService";
import { createMatchTimelineViewService } from "@/services/createMatchTimelineViewService";
import { MatchViewService } from "@/services/MatchViewService";

export async function createMatchViewService() {
  const identity = await getCurrentIdentity();

  let currentUser: {
    id: string;
    isAdmin: boolean;
  } | null = null;

  if (identity) {
    currentUser = {
      id: identity.playerId ?? identity.userId,
      isAdmin: identity.isAdmin,
    };
  }

  const matchService = await createMatchService();

  const matchTimelineViewService =
    await createMatchTimelineViewService();

  return {
    service: new MatchViewService(
      matchService,
      matchTimelineViewService
    ),
    currentUser,
  };
}
