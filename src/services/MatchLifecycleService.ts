import type { TournamentMatch } from "@/types/match";

export class MatchLifecycleService {
  canSchedule(match: TournamentMatch) {
    return (
      match.status === "unscheduled" ||
      match.status === "scheduled"
    );
  }

  canEnterResult(match: TournamentMatch) {
    return (
      match.status === "scheduled" ||
      match.status === "completed"
    );
  }

  canEditResult(match: TournamentMatch) {
    return (
      match.status === "completed" ||
      match.status === "scheduled"
    );
  }

  isFinished(match: TournamentMatch) {
    return (
      match.status === "completed" ||
      match.status === "cancelled"
    );
  }

  canCancel(match: TournamentMatch) {
    return !this.isFinished(match);
  }
}