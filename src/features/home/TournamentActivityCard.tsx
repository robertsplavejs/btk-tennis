import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

type ActivityItem = {
  id: string;
  icon: string;
  title: string;
  description?: string;
};

type TournamentActivityCardProps = {
  activities: ActivityItem[];
};

export function TournamentActivityCard({
  activities,
}: TournamentActivityCardProps) {
  return (
    <Card className="p-5">
      <SectionHeader title="Kas mainījies" action="Skatīt visu" />

      <div className="divide-y divide-black/5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 py-4 first:pt-1 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg">
              {activity.icon}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-black">
                {activity.title}
              </p>

              {activity.description && (
                <p className="mt-1 text-sm leading-5 text-black/50">
                  {activity.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}