import { NotificationFactory } from "@/core/notifications/NotificationFactory";
import type {
  MatchNotificationContext,
  NotificationPlayer,
  TournamentNotificationContext,
} from "@/core/notifications/types";
import { NotificationRepository } from "@/repositories/NotificationRepository";

export class NotificationEngine {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationFactory: NotificationFactory
  ) {}

  async matchScheduled(
    context: MatchNotificationContext
  ) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createMatchScheduled(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async matchRescheduled(
    context: MatchNotificationContext
  ) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createMatchRescheduled(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async resultCreated(
    context: MatchNotificationContext
  ) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createResultCreated(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async resultUpdated(
    context: MatchNotificationContext
  ) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createResultUpdated(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async walkover(context: MatchNotificationContext) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createWalkover(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async retired(context: MatchNotificationContext) {
    const recipients =
      this.getMatchRecipients(context);

    const notifications = recipients.map((recipient) =>
      this.notificationFactory.createRetired(
        context,
        recipient
      )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async tournamentStarted(
    context: TournamentNotificationContext
  ) {
    const recipientUserIds = Array.from(
      new Set(context.recipientUserIds)
    ).filter(
      (recipientUserId) =>
        recipientUserId &&
        recipientUserId !== context.actorUserId
    );

    const notifications = recipientUserIds.map(
      (recipientUserId) =>
        this.notificationFactory.createTournamentStarted(
          context,
          recipientUserId
        )
    );

    return this.notificationRepository.createMany(
      notifications
    );
  }

  async system(
    recipientUserId: string,
    title: string,
    body: string,
    link?: string | null
  ) {
    const notification =
      this.notificationFactory.createSystem(
        recipientUserId,
        title,
        body,
        link
      );

    return this.notificationRepository.create(
      notification
    );
  }

  private getMatchRecipients(
    context: MatchNotificationContext
  ): NotificationPlayer[] {
    return [
      context.playerOne,
      context.playerTwo,
    ].filter(
      (player) =>
        player.id &&
        player.id !== context.actorUserId
    );
  }
}