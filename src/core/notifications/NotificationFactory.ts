import { NotificationTemplates } from "@/core/notifications/NotificationTemplates";
import type {
  MatchNotificationContext,
  NotificationDraft,
  NotificationPlayer,
  TournamentNotificationContext,
} from "@/core/notifications/types";

export class NotificationFactory {
  createMatchScheduled(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template =
      NotificationTemplates.matchScheduled({
        actorName: context.actorName,
        scheduledAt: context.scheduledAt,
        location: context.location,
        court: context.court,
      });

    return this.createMatchDraft(
      context,
      recipient.id,
      "match_scheduled",
      template
    );
  }

  createMatchRescheduled(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template =
      NotificationTemplates.matchRescheduled({
        actorName: context.actorName,
        scheduledAt: context.scheduledAt,
        location: context.location,
        court: context.court,
      });

    return this.createMatchDraft(
      context,
      recipient.id,
      "match_rescheduled",
      template
    );
  }

  createResultCreated(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template =
      NotificationTemplates.resultCreated({
        actorName: context.actorName,
        score: context.score,
      });

    return this.createMatchDraft(
      context,
      recipient.id,
      "result_created",
      template
    );
  }

  createResultUpdated(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template =
      NotificationTemplates.resultUpdated({
        actorName: context.actorName,
        score: context.score,
      });

    return this.createMatchDraft(
      context,
      recipient.id,
      "result_updated",
      template
    );
  }

  createWalkover(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template = NotificationTemplates.walkover({
      winnerName: context.winnerName,
    });

    return this.createMatchDraft(
      context,
      recipient.id,
      "walkover",
      template
    );
  }

  createRetired(
    context: MatchNotificationContext,
    recipient: NotificationPlayer
  ): NotificationDraft {
    const template = NotificationTemplates.retired({
      winnerName: context.winnerName,
      score: context.score,
    });

    return this.createMatchDraft(
      context,
      recipient.id,
      "retired",
      template
    );
  }

  createTournamentStarted(
    context: TournamentNotificationContext,
    recipientUserId: string
  ): NotificationDraft {
    const template =
      NotificationTemplates.tournamentStarted(
        context.tournamentName
      );

    return {
      recipientUserId,
      type: "tournament_started",
      title: template.title,
      body: template.body,
      link: "/tournament",
      tournamentId: context.tournamentId,
      matchId: null,
    };
  }

  createSystem(
    recipientUserId: string,
    title: string,
    body: string,
    link?: string | null
  ): NotificationDraft {
    const template = NotificationTemplates.system(
      title,
      body
    );

    return {
      recipientUserId,
      type: "system",
      title: template.title,
      body: template.body,
      link: link ?? null,
      tournamentId: null,
      matchId: null,
    };
  }

  private createMatchDraft(
    context: MatchNotificationContext,
    recipientUserId: string,
    type: NotificationDraft["type"],
    template: {
      title: string;
      body: string;
    }
  ): NotificationDraft {
    return {
      recipientUserId,
      type,
      title: template.title,
      body: template.body,
      link: `/matches/${context.matchId}`,
      tournamentId: context.tournamentId,
      matchId: context.matchId,
    };
  }
}