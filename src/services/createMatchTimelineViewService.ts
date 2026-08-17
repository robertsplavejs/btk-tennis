import { createMatchHistoryService } from "@/services/createMatchHistoryService";
import { MatchTimelineViewService } from "@/services/MatchTimelineViewService";

export async function createMatchTimelineViewService() {
  const matchHistoryService =
    await createMatchHistoryService();

  return new MatchTimelineViewService(
    matchHistoryService
  );
}