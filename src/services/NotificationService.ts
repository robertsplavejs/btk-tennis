import { NotificationRepository } from "@/repositories/NotificationRepository";
import { getPlayerAvatarUrl } from "@/lib/getPlayerAvatarUrl";

export type NotificationViewItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    fullName: string;
    initials: string | null;
    avatarUrl: string | null;
  } | null;
};

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async getNotifications(
    userId: string
  ): Promise<NotificationViewItem[]> {
    const normalizedUserId = userId.trim();

    if (!normalizedUserId) {
      throw new Error("Lietotāja ID nav norādīts.");
    }

    const notifications =
      await this.notificationRepository.getByUserId(
        normalizedUserId
      );

    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      isRead: notification.is_read,
      createdAt: notification.created_at,
      actor: notification.actor
        ? {
            id: notification.actor.id,
            fullName: notification.actor.full_name,
            initials: notification.actor.initials,
            avatarUrl:
              getPlayerAvatarUrl(
                notification.actor.full_name,
                notification.actor.avatar_url
              ) ?? null,
          }
        : null,
    }));
  }

  async getUnreadCount(userId: string) {
    const normalizedUserId = userId.trim();

    if (!normalizedUserId) {
      return 0;
    }

    return this.notificationRepository.getUnreadCount(
      normalizedUserId
    );
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const normalizedNotificationId =
      notificationId.trim();

    const normalizedUserId = userId.trim();

    if (!normalizedNotificationId) {
      throw new Error("Paziņojuma ID nav norādīts.");
    }

    if (!normalizedUserId) {
      throw new Error("Lietotāja ID nav norādīts.");
    }

    return this.notificationRepository.markAsRead(
      normalizedNotificationId,
      normalizedUserId
    );
  }

  async markAllAsRead(userId: string) {
    const normalizedUserId = userId.trim();

    if (!normalizedUserId) {
      throw new Error("Lietotāja ID nav norādīts.");
    }

    return this.notificationRepository.markAllAsRead(
      normalizedUserId
    );
  }
}
