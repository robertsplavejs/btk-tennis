export type StandingRules = {
  winPoints: number;
  lossPoints: number;
  unplayedPoints: number;
};

export const BTK_STANDING_RULES: StandingRules = {
  winPoints: 3,
  lossPoints: 1,
  unplayedPoints: 0,
};

export type StandingPlayer = {
  playerId: string;
  fullName: string;
};

export type StandingSet = {
  playerOneScore: number;
  playerTwoScore: number;
  setType?: string;
};

export type StandingMatch = {
  id?: string;

  playerOneId: string;
  playerTwoId: string;

  status:
    | "unscheduled"
    | "scheduled"
    | "completed"
    | "cancelled";

  resultType:
    | "regular"
    | "walkover"
    | "retired";

  winnerId: string | null;

  sets: StandingSet[];

  completedAt?: string | null;
};

export type StandingRow = {
  position: number;

  playerId: string;
  fullName: string;

  matchesPlayed: number;

  wins: number;
  losses: number;

  walkoverWins: number;
  walkoverLosses: number;

  points: number;

  setsWon: number;
  setsLost: number;
  setDifference: number;
  setPercentage: number;

  gamesWon: number;
  gamesLost: number;
  gameDifference: number;
  gamePercentage: number;
};

type MutableStandingRow = Omit<
  StandingRow,
  | "position"
  | "setDifference"
  | "setPercentage"
  | "gameDifference"
  | "gamePercentage"
>;

function calculatePercentage(won: number, lost: number) {
  const total = won + lost;

  if (total === 0) {
    return 0;
  }

  return won / total;
}

function normalizeGameScore(set: StandingSet) {
  if (
    set.setType === "match-tiebreak" ||
    set.setType === "match_tiebreak"
  ) {
    return set.playerOneScore > set.playerTwoScore
      ? {
          playerOneGames: 1,
          playerTwoGames: 0,
        }
      : {
          playerOneGames: 0,
          playerTwoGames: 1,
        };
  }

  return {
    playerOneGames: set.playerOneScore,
    playerTwoGames: set.playerTwoScore,
  };
}

function getDirectMatchWinner(
  playerOneId: string,
  playerTwoId: string,
  matches: StandingMatch[]
) {
  const directMatch = matches.find(
    (match) =>
      match.status === "completed" &&
      match.winnerId !== null &&
      ((match.playerOneId === playerOneId &&
        match.playerTwoId === playerTwoId) ||
        (match.playerOneId === playerTwoId &&
          match.playerTwoId === playerOneId))
  );

  return directMatch?.winnerId ?? null;
}

export class StandingEngine {
  constructor(
    private readonly rules: StandingRules =
      BTK_STANDING_RULES
  ) {}

  calculate(
    players: StandingPlayer[],
    matches: StandingMatch[]
  ): StandingRow[] {
    const standings = this.createInitialStandings(players);

    this.applyCompletedMatches(standings, matches);

    const rows = this.createCalculatedRows(standings);
    const sortedRows = this.sortStandings(rows, matches);

    return sortedRows.map((row, index) => ({
      ...row,
      position: index + 1,
    }));
  }

  private createInitialStandings(
    players: StandingPlayer[]
  ) {
    const standings = new Map<
      string,
      MutableStandingRow
    >();

    for (const player of players) {
      standings.set(player.playerId, {
        playerId: player.playerId,
        fullName: player.fullName,

        matchesPlayed: 0,

        wins: 0,
        losses: 0,

        walkoverWins: 0,
        walkoverLosses: 0,

        points: 0,

        setsWon: 0,
        setsLost: 0,

        gamesWon: 0,
        gamesLost: 0,
      });
    }

    return standings;
  }

  private applyCompletedMatches(
    standings: Map<string, MutableStandingRow>,
    matches: StandingMatch[]
  ) {
    for (const match of matches) {
      if (
        match.status !== "completed" ||
        !match.winnerId
      ) {
        continue;
      }

      const playerOne = standings.get(match.playerOneId);
      const playerTwo = standings.get(match.playerTwoId);

      if (!playerOne || !playerTwo) {
        continue;
      }

      const playerOneWon =
        match.winnerId === match.playerOneId;

      const playerTwoWon =
        match.winnerId === match.playerTwoId;

      if (!playerOneWon && !playerTwoWon) {
        continue;
      }

      const winner = playerOneWon
        ? playerOne
        : playerTwo;

      const loser = playerOneWon
        ? playerTwo
        : playerOne;

      playerOne.matchesPlayed += 1;
      playerTwo.matchesPlayed += 1;

      winner.wins += 1;
      loser.losses += 1;

      winner.points += this.rules.winPoints;
      loser.points += this.rules.lossPoints;

      if (match.resultType === "walkover") {
        winner.walkoverWins += 1;
        loser.walkoverLosses += 1;

        continue;
      }

      this.applySets(playerOne, playerTwo, match.sets);
    }
  }

  private applySets(
    playerOne: MutableStandingRow,
    playerTwo: MutableStandingRow,
    sets: StandingSet[]
  ) {
    for (const set of sets) {
      if (
        !Number.isFinite(set.playerOneScore) ||
        !Number.isFinite(set.playerTwoScore) ||
        set.playerOneScore < 0 ||
        set.playerTwoScore < 0 ||
        set.playerOneScore === set.playerTwoScore
      ) {
        continue;
      }

      if (set.playerOneScore > set.playerTwoScore) {
        playerOne.setsWon += 1;
        playerTwo.setsLost += 1;
      } else {
        playerTwo.setsWon += 1;
        playerOne.setsLost += 1;
      }

      const normalizedScore = normalizeGameScore(set);

      playerOne.gamesWon += normalizedScore.playerOneGames;
      playerOne.gamesLost += normalizedScore.playerTwoGames;

      playerTwo.gamesWon += normalizedScore.playerTwoGames;
      playerTwo.gamesLost += normalizedScore.playerOneGames;
    }
  }

  private createCalculatedRows(
    standings: Map<string, MutableStandingRow>
  ): StandingRow[] {
    return Array.from(standings.values()).map((row) => ({
      ...row,

      position: 0,

      setDifference: row.setsWon - row.setsLost,

      setPercentage: calculatePercentage(
        row.setsWon,
        row.setsLost
      ),

      gameDifference: row.gamesWon - row.gamesLost,

      gamePercentage: calculatePercentage(
        row.gamesWon,
        row.gamesLost
      ),
    }));
  }

  private sortStandings(
    rows: StandingRow[],
    matches: StandingMatch[]
  ): StandingRow[] {
    const pointGroups = new Map<number, StandingRow[]>();

    for (const row of rows) {
      const group = pointGroups.get(row.points) ?? [];

      group.push(row);
      pointGroups.set(row.points, group);
    }

    const sortedPointValues = Array.from(
      pointGroups.keys()
    ).sort((first, second) => second - first);

    const sortedRows: StandingRow[] = [];

    for (const points of sortedPointValues) {
      const group = pointGroups.get(points) ?? [];

      sortedRows.push(
        ...this.sortEqualPointGroup(group, matches)
      );
    }

    return sortedRows;
  }

  private sortEqualPointGroup(
    rows: StandingRow[],
    matches: StandingMatch[]
  ) {
    if (rows.length <= 1) {
      return rows;
    }

    if (rows.length === 2) {
      const [playerOne, playerTwo] = rows;

      const directWinnerId = getDirectMatchWinner(
        playerOne.playerId,
        playerTwo.playerId,
        matches
      );

      if (directWinnerId === playerOne.playerId) {
        return [playerOne, playerTwo];
      }

      if (directWinnerId === playerTwo.playerId) {
        return [playerTwo, playerOne];
      }
    }

    return [...rows].sort((playerOne, playerTwo) => {
      if (
        playerOne.setPercentage !==
        playerTwo.setPercentage
      ) {
        return (
          playerTwo.setPercentage -
          playerOne.setPercentage
        );
      }

      if (
        playerOne.gamePercentage !==
        playerTwo.gamePercentage
      ) {
        return (
          playerTwo.gamePercentage -
          playerOne.gamePercentage
        );
      }

      if (
        playerOne.setDifference !==
        playerTwo.setDifference
      ) {
        return (
          playerTwo.setDifference -
          playerOne.setDifference
        );
      }

      if (
        playerOne.gameDifference !==
        playerTwo.gameDifference
      ) {
        return (
          playerTwo.gameDifference -
          playerOne.gameDifference
        );
      }

      if (playerOne.setsWon !== playerTwo.setsWon) {
        return playerTwo.setsWon - playerOne.setsWon;
      }

      if (playerOne.gamesWon !== playerTwo.gamesWon) {
        return playerTwo.gamesWon - playerOne.gamesWon;
      }

      return playerOne.fullName.localeCompare(
        playerTwo.fullName,
        "lv"
      );
    });
  }
}
