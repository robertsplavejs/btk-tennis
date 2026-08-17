import { ActivityRepository } from "@/repositories/ActivityRepository";
import type { Json } from "@/types/database";

export type ActivityViewItem = {
  id: string;
  activityType: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  metadata: Json;
  createdAt: string;
  matchId: string | null;
  tournament: {
    id: string;
    name: string;
    slug: string;
  } | null;
  actor: {
    id: string;
    fullName: string;
    initials: string | null;
    avatarUrl: string | null;
  } | null;
};

export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository
  ) {}

  async getLatestActivities(
    limit = 20
  ): Promise<ActivityViewItem[]> {
    const activities =
      await this.activityRepository.getLatest(limit);

    return activities.map((activity) =>
      this.toViewItem(activity)
    );
  }

  async getTournamentActivities(
    tournamentId: string,
    limit = 20
  ): Promise<ActivityViewItem[]> {
    const normalizedTournamentId = tournamentId.trim();

    if (!normalizedTournamentId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    const activities =
      await this.activityRepository.getByTournamentId(
        normalizedTournamentId,
        limit
      );

    return activities.map((activity) =>
      this.toViewItem(activity)
    );
  }

  private toViewItem(
    activity: Awaited<
      ReturnType<ActivityRepository["getLatest"]>
    >[number]
  ): ActivityViewItem {
    return {
      id: activity.id,
      activityType: activity.activity_type,
      title: activity.title,
      description: activity.description,
      icon: activity.icon,
      color: activity.color,
      metadata: activity.metadata,
      createdAt: activity.created_at,
      matchId: activity.match_id,
      tournament: activity.tournament
        ? {
            id: activity.tournament.id,
            name: activity.tournament.name,
            slug: activity.tournament.slug,
          }
        : null,
      actor: activity.actor
        ? {
            id: activity.actor.id,
            fullName: activity.actor.full_name,
            initials: activity.actor.initials,
            avatarUrl: activity.actor.avatar_url,
          }
        : null,
    };
  }
}