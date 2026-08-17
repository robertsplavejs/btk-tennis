import { ActivityService } from "@/services/ActivityService";
import {
  normalizeActivityColor,
  type ActivityColorName,
} from "@/features/activity/ActivityColor";
import { formatActivityTime } from "@/features/activity/ActivityTime";

export type ActivityCardView = {
  id: string;
  activityType: string;
  title: string;
  description: string;
  icon: string;
  color: ActivityColorName;
  createdAt: string;
  createdAtLabel: string;
  href: string | null;
  actorName: string | null;
  tournamentName: string | null;
};

export class ActivityViewService {
  constructor(
    private readonly activityService: ActivityService
  ) {}

  async getLatestActivityCards(
    limit = 10
  ): Promise<ActivityCardView[]> {
    const activities =
      await this.activityService.getLatestActivities(
        Math.max(limit * 3, limit)
      );

    const latestActivityBySubject = new Map<
      string,
      (typeof activities)[number]
    >();

    for (const activity of activities) {
      const subjectKey = activity.matchId
        ? `match:${activity.matchId}`
        : `activity:${activity.id}`;

      if (!latestActivityBySubject.has(subjectKey)) {
        latestActivityBySubject.set(subjectKey, activity);
      }
    }

    return Array.from(latestActivityBySubject.values())
      .slice(0, limit)
      .map((activity) =>
        this.toActivityCardView(activity)
      );
  }

  async getTournamentActivityCards(
    tournamentId: string,
    limit = 10
  ): Promise<ActivityCardView[]> {
    const activities =
      await this.activityService.getTournamentActivities(
        tournamentId,
        limit
      );

    return activities.map((activity) =>
      this.toActivityCardView(activity)
    );
  }

  private toActivityCardView(
    activity: Awaited<
      ReturnType<ActivityService["getLatestActivities"]>
    >[number]
  ): ActivityCardView {
    return {
      id: activity.id,
      activityType: activity.activityType,
      title: activity.title,
      description: activity.description,
      icon: activity.icon,
      color: normalizeActivityColor(activity.color),
      createdAt: activity.createdAt,
      createdAtLabel: formatActivityTime(
        activity.createdAt
      ),
      href: activity.matchId
        ? `/matches/${activity.matchId}`
        : activity.tournament
          ? `/tournament`
          : null,
      actorName: activity.actor?.fullName ?? null,
      tournamentName:
        activity.tournament?.name ?? null,
    };
  }
}
