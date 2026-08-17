export type RoundRobinPair = {
  playerOneId: string;
  playerTwoId: string;
  roundNumber: number;
};

export function generateRoundRobinPairs(
  playerIds: string[]
): RoundRobinPair[] {
  const normalizedPlayerIds = Array.from(
    new Set(
      playerIds
        .map((playerId) => playerId.trim())
        .filter(Boolean)
    )
  );

  if (normalizedPlayerIds.length < 2) {
    throw new Error(
      "Spēļu ģenerēšanai nepieciešami vismaz divi dalībnieki."
    );
  }

  const byeMarker = "__BYE__";

  const rotation =
    normalizedPlayerIds.length % 2 === 0
      ? [...normalizedPlayerIds]
      : [...normalizedPlayerIds, byeMarker];

  const playerCount = rotation.length;
  const roundsCount = playerCount - 1;
  const matchesPerRound = playerCount / 2;

  const pairs: RoundRobinPair[] = [];

  for (
    let roundIndex = 0;
    roundIndex < roundsCount;
    roundIndex += 1
  ) {
    for (
      let matchIndex = 0;
      matchIndex < matchesPerRound;
      matchIndex += 1
    ) {
      const playerOneId = rotation[matchIndex];
      const playerTwoId =
        rotation[playerCount - 1 - matchIndex];

      if (
        playerOneId === byeMarker ||
        playerTwoId === byeMarker
      ) {
        continue;
      }

      const shouldSwapSides =
        roundIndex % 2 === 1 && matchIndex === 0;

      pairs.push({
        playerOneId: shouldSwapSides
          ? playerTwoId
          : playerOneId,
        playerTwoId: shouldSwapSides
          ? playerOneId
          : playerTwoId,
        roundNumber: roundIndex + 1,
      });
    }

    const fixedPlayer = rotation[0];
    const rotatingPlayers = rotation.slice(1);
    const lastPlayer = rotatingPlayers.pop();

    if (!lastPlayer) {
      throw new Error(
        "Neizdevās sagatavot Round Robin rotāciju."
      );
    }

    rotation.splice(
      0,
      rotation.length,
      fixedPlayer,
      lastPlayer,
      ...rotatingPlayers
    );
  }

  return pairs;
}