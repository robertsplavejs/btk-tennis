import {
  StandingEngine,
  type StandingMatch,
} from "@/services/StandingEngine";
import type { TournamentView } from "@/services/TournamentViewService";
import type { TournamentMatch } from "@/types/match";

export type WinScenario = {
  matchId: string;
  opponentName: string;
  currentPosition: number;
  projectedPosition: number;
};

export class StandingScenarioService {
  findImprovingWin(
    view: TournamentView,
    playerId: string,
    candidateMatches: TournamentMatch[]
  ): WinScenario | null {
    const currentPosition = view.standings.find(
      (row) => row.playerId === playerId
    )?.position;

    if (!currentPosition) {
      return null;
    }

    const players = view.standings.map((row) => ({
      playerId: row.playerId,
      fullName: row.fullName,
    }));

    const standingEngine = new StandingEngine({
      winPoints: view.tournament.pointsForWin,
      lossPoints: view.tournament.pointsForLoss,
      unplayedPoints: 0,
    });

    for (const candidate of candidateMatches) {
      if (
        candidate.status === "completed" ||
        (candidate.playerOne.id !== playerId &&
          candidate.playerTwo.id !== playerId)
      ) {
        continue;
      }

      const simulatedMatches = view.matches.map((match) =>
        this.toStandingMatch(
          match.id === candidate.id
            ? this.createConservativeWin(match, playerId)
            : match
        )
      );

      const projectedPosition = standingEngine
        .calculate(players, simulatedMatches)
        .find((row) => row.playerId === playerId)?.position;

      if (projectedPosition && projectedPosition < currentPosition) {
        const opponent =
          candidate.playerOne.id === playerId
            ? candidate.playerTwo
            : candidate.playerOne;

        return {
          matchId: candidate.id,
          opponentName: opponent.name,
          currentPosition,
          projectedPosition,
        };
      }
    }

    return null;
  }

  private createConservativeWin(
    match: TournamentMatch,
    playerId: string
  ): TournamentMatch {
    const playerIsPlayerOne = match.playerOne.id === playerId;

    return {
      ...match,
      status: "completed",
      resultType: "regular",
      winnerId: playerId,
      sets: playerIsPlayerOne
        ? [
            { playerOneGames: 0, playerTwoGames: 6, setType: "regular" },
            { playerOneGames: 7, playerTwoGames: 6, setType: "regular" },
            { playerOneGames: 11, playerTwoGames: 9, setType: "match_tiebreak" },
          ]
        : [
            { playerOneGames: 6, playerTwoGames: 0, setType: "regular" },
            { playerOneGames: 6, playerTwoGames: 7, setType: "regular" },
            { playerOneGames: 9, playerTwoGames: 11, setType: "match_tiebreak" },
          ],
    };
  }

  private toStandingMatch(match: TournamentMatch): StandingMatch {
    return {
      id: match.id,
      playerOneId: match.playerOne.id,
      playerTwoId: match.playerTwo.id,
      status: match.status,
      resultType: match.resultType ?? "regular",
      winnerId: match.winnerId ?? null,
      completedAt: match.updatedAt ?? null,
      sets: (match.sets ?? []).map((set) => ({
        playerOneScore: set.playerOneGames,
        playerTwoScore: set.playerTwoGames,
        setType: set.setType,
      })),
    };
  }
}
