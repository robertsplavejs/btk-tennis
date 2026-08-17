export type StandingsPlayer = {
  id: string;
  name: string;
};

export type StandingsSet = {
  setType: string;
  playerOneScore: number;
  playerTwoScore: number;
};

export type StandingsMatch = {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  winnerId: string | null;
  status: string;
  sets: StandingsSet[];
};

export type StandingRow = {
  position: number;
  playerId: string;
  playerName: string;
  played: number;
  wins: number;
  losses: number;
  points: number;
  setsWon: number;
  setsLost: number;
  setDifference: number;
  gamesWon: number;
  gamesLost: number;
  gameDifference: number;
};

type MutableStandingRow = Omit<StandingRow, "position">;

function normalizeSetScore(set: StandingsSet) {
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

function compareHeadToHead(
  playerOneId: string,
  playerTwoId: string,
  matches: StandingsMatch[]
) {
  const directMatch = matches.find(
    (match) =>
      match.status === "completed" &&
      ((match.playerOneId === playerOneId &&
        match.playerTwoId === playerTwoId) ||
        (match.playerOneId === playerTwoId &&
          match.playerTwoId === playerOneId))
  );

  if (!directMatch?.winnerId) {
    return 0;
  }

  return directMatch.winnerId === playerOneId ? -1 : 1;
}

export function calculateStandings(
  players: StandingsPlayer[],
  matches: StandingsMatch[],
  pointsForWin: number,
  pointsForLoss: number
): StandingRow[] {
  const standings = new Map<string, MutableStandingRow>();

  for (const player of players) {
    standings.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      played: 0,
      wins: 0,
      losses: 0,
      points: 0,
      setsWon: 0,
      setsLost: 0,
      setDifference: 0,
      gamesWon: 0,
      gamesLost: 0,
      gameDifference: 0,
    });
  }

  for (const match of matches) {
    if (match.status !== "completed" || !match.winnerId) {
      continue;
    }

    const playerOneStanding = standings.get(match.playerOneId);
    const playerTwoStanding = standings.get(match.playerTwoId);

    if (!playerOneStanding || !playerTwoStanding) {
      continue;
    }

    playerOneStanding.played += 1;
    playerTwoStanding.played += 1;

    if (match.winnerId === match.playerOneId) {
      playerOneStanding.wins += 1;
      playerTwoStanding.losses += 1;
      playerOneStanding.points += pointsForWin;
      playerTwoStanding.points += pointsForLoss;
    } else {
      playerTwoStanding.wins += 1;
      playerOneStanding.losses += 1;
      playerTwoStanding.points += pointsForWin;
      playerOneStanding.points += pointsForLoss;
    }

    for (const set of match.sets) {
      if (set.playerOneScore === set.playerTwoScore) {
        continue;
      }

      if (set.playerOneScore > set.playerTwoScore) {
        playerOneStanding.setsWon += 1;
        playerTwoStanding.setsLost += 1;
      } else {
        playerTwoStanding.setsWon += 1;
        playerOneStanding.setsLost += 1;
      }

      const normalizedScore = normalizeSetScore(set);

      playerOneStanding.gamesWon +=
        normalizedScore.playerOneGames;
      playerOneStanding.gamesLost +=
        normalizedScore.playerTwoGames;

      playerTwoStanding.gamesWon +=
        normalizedScore.playerTwoGames;
      playerTwoStanding.gamesLost +=
        normalizedScore.playerOneGames;
    }
  }

  const rows = Array.from(standings.values()).map((row) => ({
    ...row,
    setDifference: row.setsWon - row.setsLost,
    gameDifference: row.gamesWon - row.gamesLost,
  }));

  rows.sort((playerOne, playerTwo) => {
    if (playerOne.points !== playerTwo.points) {
      return playerTwo.points - playerOne.points;
    }

    const tiedPlayers = rows.filter(
      (row) => row.points === playerOne.points
    );

    if (tiedPlayers.length === 2) {
      const headToHeadComparison = compareHeadToHead(
        playerOne.playerId,
        playerTwo.playerId,
        matches
      );

      if (headToHeadComparison !== 0) {
        return headToHeadComparison;
      }
    }

    if (
      playerOne.setDifference !== playerTwo.setDifference
    ) {
      return playerTwo.setDifference - playerOne.setDifference;
    }

    if (
      playerOne.gameDifference !== playerTwo.gameDifference
    ) {
      return playerTwo.gameDifference - playerOne.gameDifference;
    }

    if (playerOne.setsWon !== playerTwo.setsWon) {
      return playerTwo.setsWon - playerOne.setsWon;
    }

    if (playerOne.gamesWon !== playerTwo.gamesWon) {
      return playerTwo.gamesWon - playerOne.gamesWon;
    }

    return playerOne.playerName.localeCompare(
      playerTwo.playerName,
      "lv"
    );
  });

  return rows.map((row, index) => ({
    ...row,
    position: index + 1,
  }));
}
