import { MatchService } from "@/services/MatchService";
import { MatchTimelineViewService } from "@/services/MatchTimelineViewService";

export class MatchNotFoundError extends Error {
  constructor() {
    super("Spēle nav atrasta.");
    this.name = "MatchNotFoundError";
  }
}

export type MatchView = {
  match: NonNullable<
    Awaited<ReturnType<MatchService["getMatchById"]>>
  >;
  timelineItems: Awaited<
    ReturnType<MatchTimelineViewService["getTimeline"]>
  >;
  currentUser: {
    id: string;
    isAdmin: boolean;
    isParticipant: boolean;
    canManageMatch: boolean;
  } | null;
};

type CurrentUserInput = {
  id: string;
  isAdmin: boolean;
} | null;

export class MatchViewService {
  constructor(
    private readonly matchService: MatchService,
    private readonly matchTimelineViewService: MatchTimelineViewService
  ) {}

  async getMatchView(
    matchId: string,
    currentUser: CurrentUserInput
  ): Promise<MatchView> {
    const normalizedMatchId = matchId.trim();

    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    const [match, timelineItems] = await Promise.all([
      this.matchService.getMatchById(normalizedMatchId),
      this.matchTimelineViewService.getTimeline(
        normalizedMatchId
      ),
    ]);

    if (!match) {
      throw new MatchNotFoundError();
    }

    const isParticipant = currentUser
      ? currentUser.id === match.player_one_id ||
        currentUser.id === match.player_two_id
      : false;

    return {
      match,
      timelineItems,
      currentUser: currentUser
        ? {
            id: currentUser.id,
            isAdmin: currentUser.isAdmin,
            isParticipant,
            canManageMatch:
              currentUser.isAdmin || isParticipant,
          }
        : null,
    };
  }
}
