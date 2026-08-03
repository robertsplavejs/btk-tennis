import type { MatchSet } from "@/types/match";

type SetType = "regular" | "match-tiebreak";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

export function validateMatchSet(
  set: MatchSet,
  type: SetType = "regular"
): ValidationResult {
  const { playerOneGames, playerTwoGames } = set;

  if (playerOneGames < 0 || playerTwoGames < 0) {
    return {
      valid: false,
      message: "Rezultāts nevar būt negatīvs.",
    };
  }

  if (playerOneGames === playerTwoGames) {
    return {
      valid: false,
      message: "Setā jābūt uzvarētājam.",
    };
  }

  const winnerScore = Math.max(playerOneGames, playerTwoGames);
  const loserScore = Math.min(playerOneGames, playerTwoGames);
  const difference = winnerScore - loserScore;

  if (type === "match-tiebreak") {
    if (winnerScore < 10 || difference < 2) {
      return {
        valid: false,
        message:
          "Mača taibreikā jāspēlē vismaz līdz 10 punktiem ar divu punktu pārsvaru.",
      };
    }

    return { valid: true };
  }

  if (winnerScore === 6 && loserScore <= 4) {
    return { valid: true };
  }

  if (winnerScore === 7 && (loserScore === 5 || loserScore === 6)) {
    return { valid: true };
  }

  return {
    valid: false,
    message:
      "Ievadi derīgu seta rezultātu, piemēram, 6:3, 7:5 vai 7:6.",
  };
}