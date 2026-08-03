import type { TournamentMatch } from "@/types/match";

export function formatMatchScore(match: TournamentMatch): string {
  if (!match.sets || match.sets.length === 0) {
    return "—";
  }

  return match.sets
    .map((set) => {
      const score = `${set.playerOneGames}:${set.playerTwoGames}`;

      if (!set.tiebreak) {
        return score;
      }

      return `${score}(${set.tiebreak.playerOnePoints})`;
    })
    .join("  ");
}