import Image from "next/image";

import type { MatchCardTheme } from "./MatchCardTheme";
import type { MatchCardPlayer } from "./types";

type MatchCardPlayersProps = {
  playerOne: MatchCardPlayer;
  playerTwo: MatchCardPlayer;
  theme: MatchCardTheme;
};

function Player({
  player,
  theme,
}: {
  player: MatchCardPlayer;
  theme: MatchCardTheme;
}) {
  const initials =
    player.initials ??
    player.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-w-0 text-center">
      {player.avatarUrl ? (
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={player.avatarUrl}
            alt={player.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold"
          style={{
            background: player.winner
              ? theme.winnerBackground
              : theme.loserBackground,
            color: player.winner
              ? theme.winnerText
              : theme.loserText,
          }}
        >
          {initials}
        </div>
      )}

      <p
        className="mt-3 break-words text-base font-semibold"
        style={{
          color: theme.primaryText,
        }}
      >
        {player.name}
      </p>

      {player.winner && (
        <span
          className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
          style={{
            background: theme.winnerBackground,
            color: theme.winnerText,
          }}
        >
          Uzvarētājs
        </span>
      )}
    </div>
  );
}

export function MatchCardPlayers({
  playerOne,
  playerTwo,
  theme,
}: MatchCardPlayersProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4 px-6 py-6">
      <Player player={playerOne} theme={theme} />

      <div
        className="pt-8 text-sm font-semibold"
        style={{
          color: theme.secondaryText,
        }}
      >
        VS
      </div>

      <Player player={playerTwo} theme={theme} />
    </div>
  );
}