import { NotificationService } from "@/services/NotificationService";

export type LayoutCurrentUser = {
  userId: string;
  playerId: string | null;
  fullName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export type LayoutView = {
  currentUser: LayoutCurrentUser | null;
  unreadNotifications: number;
};

export class LayoutViewService {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async getLayoutView(
    currentUser: LayoutCurrentUser | null
  ): Promise<LayoutView> {
    if (!currentUser) {
      return {
        currentUser: null,
        unreadNotifications: 0,
      };
    }

    const unreadNotifications = currentUser.playerId
      ? await this.notificationService.getUnreadCount(
          currentUser.playerId
        )
      : 0;

    return {
      currentUser,
      unreadNotifications,
    };
  }
}
