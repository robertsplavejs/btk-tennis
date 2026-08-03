import clsx from "clsx";

import { Card } from "@/components/ui/Card";
import type { StandingPlayer } from "@/types/player";

type StandingsTableProps = {
  standings: StandingPlayer[];
  currentPlayerId: string;
  qualificationPlaces?: number;
};

function getPositionChange(player: StandingPlayer) {
  const change = player.previousPosition - player.position;

  if (change > 0) {
    return {
      label: `↑ ${change}`,
      className: "text-green-600",
    };
  }

  if (change < 0) {
    return {
      label: `↓ ${Math.abs(change)}`,
      className: "text-red-600",
    };
  }

  return {
    label: "—",
    className: "text-neutral-400",
  };
}

export function StandingsTable({
  standings,
  currentPlayerId,
  qualificationPlaces = 8,
}: StandingsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-black/5 px-5 py-4">
        <div className="grid grid-cols-[36px_1fr_56px_56px] items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          <span>#</span>
          <span>Spēlētājs</span>
          <span className="text-center">Spēles</span>
          <span className="text-right">Punkti</span>
        </div>
      </div>

      <div>
        {standings.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const positionChange = getPositionChange(player);
          const showQualificationLine =
            player.position === qualificationPlaces + 1;

          return (
            <div key={player.id}>
              {showQualificationLine && (
                <div className="flex items-center gap-3 bg-neutral-50 px-5 py-2">
                  <div className="h-px flex-1 bg-neutral-300" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    TOP {qualificationPlaces}
                  </span>
                  <div className="h-px flex-1 bg-neutral-300" />
                </div>
              )}

              <div
                className={clsx(
                  "grid grid-cols-[36px_1fr_56px_56px] items-center gap-2 border-b border-black/5 px-5 py-4 last:border-b-0",
                  isCurrentPlayer && "bg-blue-50"
                )}
              >
                <div
                  className={clsx(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                    isCurrentPlayer
                      ? "bg-[var(--btk-primary)] text-white"
                      : "bg-neutral-100 text-neutral-700"
                  )}
                >
                  {player.position}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-black">
                      {player.name}
                    </p>

                    {isCurrentPlayer && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                        Tu
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                    <span>
                      {player.wins}–{player.losses}
                    </span>

                    <span className={positionChange.className}>
                      {positionChange.label}
                    </span>
                  </div>
                </div>

                <div className="text-center text-sm text-neutral-700">
                  {player.played}
                </div>

                <div className="text-right text-sm font-semibold text-black">
                  {player.points}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}