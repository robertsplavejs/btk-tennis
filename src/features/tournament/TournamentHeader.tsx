import { Card } from "@/components/ui/Card";

type TournamentHeaderProps = {
  tournament: string;
  group: string;
  position: number;
  points: number;
  played: number;
  totalMatches: number;
  positionChange: number;
};

export function TournamentHeader({
  tournament,
  group,
  position,
  points,
  played,
  totalMatches,
  positionChange,
}: TournamentHeaderProps) {
  const progress = Math.round((played / totalMatches) * 100);

  return (
    <Card className="overflow-hidden">
      <div className="bg-[var(--btk-primary)] text-white p-6">

        <p className="text-sm opacity-80">
          {tournament}
        </p>

        <p className="mt-1 text-sm opacity-70">
          {group}
        </p>

        <div className="mt-6 flex items-end justify-between">

          <div>

            <div className="text-5xl font-bold">
              {position}.
            </div>

            <div className="mt-2 text-3xl font-semibold">
              {points} punkti
            </div>

          </div>

          <div className="text-right">

            <div className="text-sm opacity-70">
              Spēles
            </div>

            <div className="text-2xl font-semibold">
              {played}/{totalMatches}
            </div>

          </div>

        </div>

      </div>

      <div className="p-5">

        <div className="flex justify-between items-center">

          <span className="text-sm text-neutral-500">
            Pozīcijas izmaiņa
          </span>

          <span className="font-semibold text-green-600">
            ▲ +{positionChange}
          </span>

        </div>

        <div className="mt-4 h-2 rounded-full bg-neutral-200 overflow-hidden">

          <div
            className="h-full rounded-full bg-[var(--btk-primary)]"
            style={{ width: `${progress}%` }}
          />

        </div>

        <div className="mt-2 flex justify-between text-xs text-neutral-500">

          <span>{played} spēles</span>

          <span>{progress}%</span>

        </div>

      </div>

    </Card>
  );
}