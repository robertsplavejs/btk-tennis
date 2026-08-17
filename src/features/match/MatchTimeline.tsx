import { Card } from "@/components/ui/Card";
import type { MatchTimelineItemView } from "@/services/MatchTimelineViewService";

type MatchTimelineProps = {
  items: MatchTimelineItemView[];
};

function formatTimelineDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Laiks nav pieejams";
  }

  return new Intl.DateTimeFormat("lv-LV", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function MatchTimeline({
  items,
}: MatchTimelineProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-black">
        Spēles vēsture
      </h2>

      <div className="mt-5 space-y-0">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <div
              key={item.id}
              className="grid grid-cols-[20px_1fr] gap-3"
            >
              <div className="flex flex-col items-center">
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[var(--btk-primary)]" />

                {!isLastItem && (
                  <div className="min-h-10 w-px flex-1 bg-neutral-200" />
                )}
              </div>

              <div
                className={
                  isLastItem
                    ? "pb-0"
                    : "border-b border-black/5 pb-5"
                }
              >
                <p className="font-semibold text-black">
                  {item.title}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  {item.author}
                </p>

                <p className="mt-1 text-xs text-neutral-400 first-letter:uppercase">
                  {formatTimelineDate(item.createdAt)}
                </p>

                {item.newScore && (
                  <div className="mt-3 rounded-2xl bg-neutral-50 px-4 py-3">
                    <p className="text-xs font-medium text-neutral-400">
                      Rezultāts
                    </p>

                    <p className="mt-1 text-base font-bold text-black">
                      {item.newScore}
                    </p>

                    {item.previousScore &&
                      item.previousScore !==
                        item.newScore && (
                        <p className="mt-2 text-xs text-neutral-500">
                          Iepriekš: {item.previousScore}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}