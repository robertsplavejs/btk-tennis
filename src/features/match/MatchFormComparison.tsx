import clsx from "clsx";

import { Card } from "@/components/ui/Card";
import type { MatchFormResult, MatchPlayer } from "@/types/match";

type MatchFormComparisonProps = {
  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;
};

function FormDots({
  results = [],
}: {
  results?: MatchFormResult[];
}) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-neutral-400">
        Forma nav pieejama
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {results.slice(-5).map((result, index) => (
        <span
          key={`${result}-${index}`}
          title={result === "win" ? "Uzvara" : "Zaudējums"}
          className={clsx(
            "h-3 w-3 rounded-full",
            result === "win" ? "bg-green-500" : "bg-red-400"
          )}
        />
      ))}
    </div>
  );
}

function PlayerForm({
  player,
}: {
  player: MatchPlayer;
}) {
  const wins =
    player.recentForm?.filter((result) => result === "win").length ?? 0;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-black">
          {player.name}
        </p>

        <p className="mt-1 text-xs text-neutral-400">
          {player.recentForm?.length
            ? `${wins} uzvaras pēdējās ${player.recentForm.length} spēlēs`
            : "Nav pieejamu datu"}
        </p>
      </div>

      <FormDots results={player.recentForm} />
    </div>
  );
}

export function MatchFormComparison({
  playerOne,
  playerTwo,
}: MatchFormComparisonProps) {
  return (
    <Card className="p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Forma
        </p>

        <h2 className="mt-1 text-lg font-semibold text-black">
          Pēdējās 5 spēles
        </h2>
      </div>

      <div className="mt-3 divide-y divide-black/5">
        <PlayerForm player={playerOne} />
        <PlayerForm player={playerTwo} />
      </div>
    </Card>
  );
}