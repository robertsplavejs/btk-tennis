import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type PlayerStatusCardProps = {
  name?: string;
  group?: string;
  initials?: string;
  position?: number;
  positionChange?: number;
  record?: string;
  winRate?: number;
  nextPositionMessage?: string;
};

export function PlayerStatusCard({
  name = "Roberts Pļāvējs",
  group = "Vīrieši A",
  initials = "RP",
  position = 3,
  positionChange = 1,
  record = "13–5",
  winRate = 72,
  nextPositionMessage = "Vēl viena uzvara līdz 2. vietai",
}: PlayerStatusCardProps) {
  const badgeColor =
    positionChange > 0
      ? "green"
      : positionChange < 0
        ? "red"
        : "gray";

  const badgeText =
    positionChange > 0
      ? `↑ +${positionChange}`
      : positionChange < 0
        ? `↓ ${positionChange}`
        : "—";

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} size="lg" />

          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {name}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {group}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold tracking-tight">
              🥉 {position}. vieta
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              {nextPositionMessage}
            </p>
          </div>

          <Badge color={badgeColor}>
            {badgeText}
          </Badge>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-neutral-50 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Bilance
            </p>

            <p className="mt-1 text-xl font-semibold">
              {record}
            </p>
          </div>

          <div className="h-10 w-px bg-neutral-200" />

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Uzvaras
            </p>

            <p className="mt-1 text-xl font-semibold">
              {winRate}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}