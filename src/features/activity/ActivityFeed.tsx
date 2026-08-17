import { Card } from "@/components/ui/Card";
import { ActivityCard } from "@/features/activity/ActivityCard";
import type { ActivityCardView } from "@/services/ActivityViewService";

type ActivityFeedProps = {
  activities: ActivityCardView[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ActivityFeed({
  activities,
  title = "Kluba aktivitātes",
  emptyTitle = "Aktivitāšu vēl nav",
  emptyDescription = "Šeit parādīsies jaunākie turnīra notikumi.",
}: ActivityFeedProps) {
  return (
    <Card className="overflow-hidden shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
      <div className="px-5 pt-3.5" style={{ minHeight: 35, padding: "14px 20px 0" }}>
        <h2 className="text-[9px] font-black uppercase leading-none tracking-[0.14em] text-neutral-400" style={{ margin: 0, color: "#9ca3af", fontSize: 9, fontWeight: 900, lineHeight: 1, letterSpacing: ".14em" }}>
          {title}
        </h2>
      </div>

      {activities.length === 0 ? (
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg">
            🎾
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-black">
              {emptyTitle}
            </h3>

            <p className="mt-0.5 text-sm leading-5 text-neutral-500">
              {emptyDescription}
            </p>
          </div>
        </div>
      ) : (
        <div>
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              showDivider={index < activities.length - 1}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
