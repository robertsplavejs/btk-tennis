import type { NotificationDraft } from "@/core/notifications/types";
import { BaseRepository } from "@/repositories/BaseRepository";

export class NotificationRepository extends BaseRepository {
  async create(notification: NotificationDraft) {
    const { data, error } = await this.supabase.rpc(
      "create_notification",
      {
        target_user_id: notification.recipientUserId,
        notification_type: notification.type,
        notification_title: notification.title,
        notification_body: notification.body,
        notification_link:
          notification.link ?? undefined,
        target_tournament_id:
          notification.tournamentId ?? undefined,
        target_match_id:
          notification.matchId ?? undefined,
      }
    );

    if (error) {
      throw new Error(
        `Neizdevās izveidot paziņojumu: ${error.message}`
      );
    }

    return data;
  }

  async createMany(notifications: NotificationDraft[]) {
    if (notifications.length === 0) {
      return [];
    }

    return Promise.all(
      notifications.map((notification) =>
        this.create(notification)
      )
    );
  }

  async getByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("notifications")
      .select(`
        *,
        actor:players!notifications_actor_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `Neizdevās ielādēt paziņojumus: ${error.message}`
      );
    }

    return data;
  }

  async getUnreadCount(userId: string) {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      throw new Error(
        `Neizdevās ielādēt nelasīto paziņojumu skaitu: ${error.message}`
      );
    }

    return count ?? 0;
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ) {
    const { data, error } = await this.supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(
        `Neizdevās atzīmēt paziņojumu kā izlasītu: ${error.message}`
      );
    }

    return data;
  }

  async markAllAsRead(userId: string) {
    const { data, error } = await this.supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("is_read", false)
      .select();

    if (error) {
      throw new Error(
        `Neizdevās atzīmēt paziņojumus kā izlasītus: ${error.message}`
      );
    }

    return data;
  }
}