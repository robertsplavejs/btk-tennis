import { MatchHistoryService } from "@/services/MatchHistoryService";
import type { Json } from "@/types/database";

export type MatchTimelineItemView = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  newScore: string | null;
  previousScore: string | null;
};

type ResultSnapshot = {
  sets?: Array<{
    playerOneScore?: number;
    playerTwoScore?: number;
  }>;
};

export class MatchTimelineViewService {
  constructor(
    private readonly matchHistoryService: MatchHistoryService
  ) {}

  async getTimeline(
    matchId: string
  ): Promise<MatchTimelineItemView[]> {
    const history =
      await this.matchHistoryService.getMatchHistory(matchId);

    return history.map((entry) => ({
      id: entry.id,
      title: this.getActionTitle(entry.action),
      author:
        entry.user?.player?.full_name ??
        (entry.user ? "Administrators" : "Nezināms lietotājs"),
      createdAt: entry.created_at,
      newScore: this.getScore(entry.new_value),
      previousScore: this.getScore(entry.old_value),
    }));
  }

  private getActionTitle(action: string) {
    switch (action) {
      case "result_created":
        return "Rezultāts ievadīts";

      case "result_updated":
        return "Rezultāts izlabots";

      case "schedule_created":
        return "Spēle ieplānota";

      case "schedule_updated":
        return "Spēle pārcelta";

      case "walkover":
        return "Piešķirta tehniskā uzvara";

      case "retired":
        return "Spēle pabeigta ar izstāšanos";

      case "cancelled":
        return "Spēle atcelta";

      default:
        return "Spēles informācija atjaunināta";
    }
  }

  private getScore(value: Json | null): string | null {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      return null;
    }

    const snapshot = value as ResultSnapshot;

    if (!Array.isArray(snapshot.sets)) {
      return null;
    }

    const score = snapshot.sets
      .filter(
        (set) =>
          typeof set.playerOneScore === "number" &&
          typeof set.playerTwoScore === "number"
      )
      .map(
        (set) =>
          `${set.playerOneScore}:${set.playerTwoScore}`
      )
      .join(" · ");

    return score || null;
  }
}
