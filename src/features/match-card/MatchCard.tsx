import {
  getMatchCardTheme,
} from "./MatchCardTheme";

import type { MatchCardData } from "./types";

import { MatchCardHeader } from "./MatchCardHeader";
import { MatchCardPlayers } from "./MatchCardPlayers";
import { MatchCardScore } from "./MatchCardScore";
import { MatchCardSets } from "./MatchCardSets";
import { MatchCardFooter } from "./MatchCardFooter";

type MatchCardProps = {
  data: MatchCardData;
};

export function MatchCard({
  data,
}: MatchCardProps) {
  const theme = getMatchCardTheme(data.theme);

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-[32px] border shadow-xl"
      style={{
        background: theme.background,
        borderColor: theme.border,
      }}
    >
      <MatchCardHeader
        tournamentName={data.tournamentName}
        tournamentStage={data.tournamentStage}
        logoUrl={data.logoUrl}
        theme={theme}
      />

      <MatchCardPlayers
        playerOne={data.playerOne}
        playerTwo={data.playerTwo}
        theme={theme}
      />

      <MatchCardScore
        score={data.matchScore}
        theme={theme}
      />

      <MatchCardSets
        sets={data.sets}
        theme={theme}
      />

      <MatchCardFooter
        playedAt={data.playedAt}
        location={data.location}
        court={data.court}
        theme={theme}
      />
    </div>
  );
}