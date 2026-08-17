import Link from "next/link";
import clsx from "clsx";

import {
  getActivityColorClasses,
} from "@/features/activity/ActivityColor";
import type { ActivityCardView } from "@/services/ActivityViewService";

type ActivityCardProps = {
  activity: ActivityCardView;
  showDivider?: boolean;
};

function ActivityCardContent({
  activity,
  showDivider = true,
}: ActivityCardProps) {
  const colorClasses =
    getActivityColorClasses(activity.color);

  return (
    <div
      className={clsx(
        "relative flex items-start gap-3 px-4 py-3",
        showDivider &&
          "border-b border-black/5"
      )}
    >
      <div
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg",
          colorClasses.iconBackground,
          colorClasses.iconText
        )}
        aria-hidden="true"
      >
        {activity.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-black">
            {activity.title}
          </p>

          <p className="shrink-0 text-xs text-neutral-400">
            {activity.createdAtLabel}
          </p>
        </div>

        <p className="mt-1 text-sm leading-5 text-neutral-600">
          {activity.description}
        </p>

        {(activity.actorName ||
          activity.tournamentName) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
            {activity.actorName && (
              <span>{activity.actorName}</span>
            )}

            {activity.actorName &&
              activity.tournamentName && (
                <span>·</span>
              )}

            {activity.tournamentName && (
              <span>{activity.tournamentName}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivityCard({
  activity,
  showDivider = true,
}: ActivityCardProps) {
  if (!activity.href) {
    return (
      <ActivityCardContent
        activity={activity}
        showDivider={showDivider}
      />
    );
  }

  return (
    <Link
      href={activity.href}
      className="block transition-colors hover:bg-neutral-50"
    >
      <ActivityCardContent
        activity={activity}
        showDivider={showDivider}
      />
    </Link>
  );
}
