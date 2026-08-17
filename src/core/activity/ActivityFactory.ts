import { ActivityTemplates } from "@/core/activity/ActivityTemplates";
import type {
  ActivityDraft,
  MatchActivityContext,
  SystemActivityContext,
  TournamentActivityContext,
} from "@/core/activity/types";

export class ActivityFactory {
  createMatchResult(
    context: MatchActivityContext
  ): ActivityDraft {
    const template = ActivityTemplates.matchResult({
      winnerName: context.winnerName,
      loserName: context.loserName,
      score: context.score,
    });

    return {
      activityType: "match_result",
      title: template.title,
      description: template.description,
      icon: "🎾",
      color: "green",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        winnerId: context.winnerId ?? null,
        winnerName: context.winnerName ?? null,
        loserId: context.loserId ?? null,
        loserName: context.loserName ?? null,
        score: context.score ?? null,
      },
    };
  }

  createMatchUpdated(
    context: MatchActivityContext
  ): ActivityDraft {
    const template = ActivityTemplates.matchUpdated({
      winnerName: context.winnerName,
      loserName: context.loserName,
      score: context.score,
    });

    return {
      activityType: "match_updated",
      title: template.title,
      description: template.description,
      icon: "🎾",
      color: "blue",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        winnerId: context.winnerId ?? null,
        winnerName: context.winnerName ?? null,
        loserId: context.loserId ?? null,
        loserName: context.loserName ?? null,
        score: context.score ?? null,
      },
    };
  }

  createMatchScheduled(
    context: MatchActivityContext
  ): ActivityDraft {
    const template =
      ActivityTemplates.matchScheduled({
        actorName: context.actorName,
        playerOneName: context.playerOne.fullName,
        playerTwoName: context.playerTwo.fullName,
        scheduledAt: context.scheduledAt,
        location: context.location,
        court: context.court,
      });

    return {
      activityType: "match_scheduled",
      title: template.title,
      description: template.description,
      icon: "📅",
      color: "blue",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        playerOneId: context.playerOne.id,
        playerOneName: context.playerOne.fullName,
        playerTwoId: context.playerTwo.id,
        playerTwoName: context.playerTwo.fullName,
        scheduledAt: context.scheduledAt ?? null,
        location: context.location ?? null,
        court: context.court ?? null,
      },
    };
  }

  createMatchRescheduled(
    context: MatchActivityContext
  ): ActivityDraft {
    const template =
      ActivityTemplates.matchRescheduled({
        actorName: context.actorName,
        playerOneName: context.playerOne.fullName,
        playerTwoName: context.playerTwo.fullName,
        scheduledAt: context.scheduledAt,
        location: context.location,
        court: context.court,
      });

    return {
      activityType: "match_rescheduled",
      title: template.title,
      description: template.description,
      icon: "📅",
      color: "orange",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        playerOneId: context.playerOne.id,
        playerOneName: context.playerOne.fullName,
        playerTwoId: context.playerTwo.id,
        playerTwoName: context.playerTwo.fullName,
        scheduledAt: context.scheduledAt ?? null,
        location: context.location ?? null,
        court: context.court ?? null,
      },
    };
  }

  createWalkover(
    context: MatchActivityContext
  ): ActivityDraft {
    const template = ActivityTemplates.walkover({
      winnerName: context.winnerName,
      loserName: context.loserName,
    });

    return {
      activityType: "walkover",
      title: template.title,
      description: template.description,
      icon: "🏆",
      color: "orange",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        winnerId: context.winnerId ?? null,
        winnerName: context.winnerName ?? null,
        loserId: context.loserId ?? null,
        loserName: context.loserName ?? null,
      },
    };
  }

  createRetired(
    context: MatchActivityContext
  ): ActivityDraft {
    const template = ActivityTemplates.retired({
      winnerName: context.winnerName,
      loserName: context.loserName,
      score: context.score,
    });

    return {
      activityType: "retired",
      title: template.title,
      description: template.description,
      icon: "🎾",
      color: "red",
      tournamentId: context.tournamentId,
      matchId: context.matchId,
      metadata: {
        winnerId: context.winnerId ?? null,
        winnerName: context.winnerName ?? null,
        loserId: context.loserId ?? null,
        loserName: context.loserName ?? null,
        score: context.score ?? null,
      },
    };
  }

  createTournamentStarted(
    context: TournamentActivityContext
  ): ActivityDraft {
    const template =
      ActivityTemplates.tournamentStarted(
        context.tournamentName
      );

    return {
      activityType: "tournament_started",
      title: template.title,
      description: template.description,
      icon: "🏆",
      color: "purple",
      tournamentId: context.tournamentId,
      matchId: null,
      metadata: {
        tournamentName: context.tournamentName,
      },
    };
  }

  createTournamentFinished(
    context: TournamentActivityContext
  ): ActivityDraft {
    const template =
      ActivityTemplates.tournamentFinished(
        context.tournamentName
      );

    return {
      activityType: "tournament_finished",
      title: template.title,
      description: template.description,
      icon: "🏆",
      color: "green",
      tournamentId: context.tournamentId,
      matchId: null,
      metadata: {
        tournamentName: context.tournamentName,
      },
    };
  }

  createSystem(
    context: SystemActivityContext
  ): ActivityDraft {
    const template = ActivityTemplates.system(
      context.title,
      context.description
    );

    return {
      activityType: "system",
      title: template.title,
      description: template.description,
      icon: "ℹ️",
      color: "gray",
      tournamentId: context.tournamentId ?? null,
      matchId: context.matchId ?? null,
      metadata: context.metadata ?? {},
    };
  }
}