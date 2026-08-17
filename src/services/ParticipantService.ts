import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import type { Database } from "@/types/database";

type MatchInsert =
  Database["public"]["Tables"]["matches"]["Insert"];

export type AddParticipantsResult = {
  addedParticipantsCount: number;
  createdMatchesCount: number;
};

export class ParticipantService {
  constructor(
    private readonly participantRepository: ParticipantRepository,
    private readonly matchRepository: MatchRepository
  ) {}

  private async requireMainGroup(tournamentId: string) {
    const normalizedTournamentId = tournamentId.trim();

    if (!normalizedTournamentId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    const group =
      await this.participantRepository.getMainGroupByTournamentId(
        normalizedTournamentId
      );

    if (!group) {
      throw new Error(
        "Turnīram nav izveidota tehniskā dalībnieku grupa."
      );
    }

    return group;
  }

  async getParticipants(tournamentId: string) {
    const group = await this.requireMainGroup(tournamentId);

    return this.participantRepository.getByGroupId(group.id);
  }

  async addParticipants(
    tournamentId: string,
    playerIds: string[]
  ): Promise<AddParticipantsResult> {
    const normalizedTournamentId = tournamentId.trim();

    const group = await this.requireMainGroup(
      normalizedTournamentId
    );

    const normalizedPlayerIds = Array.from(
      new Set(
        playerIds
          .map((playerId) => playerId.trim())
          .filter(Boolean)
      )
    );

    if (normalizedPlayerIds.length === 0) {
      throw new Error("Izvēlies vismaz vienu spēlētāju.");
    }

    const [currentParticipants, existingMatches] =
      await Promise.all([
        this.participantRepository.getByGroupId(group.id),
        this.matchRepository.getByTournamentId(
          normalizedTournamentId
        ),
      ]);

    const currentPlayerIds = new Set(
      currentParticipants.map(
        (participant) => participant.player_id
      )
    );

    const newPlayerIds = normalizedPlayerIds.filter(
      (playerId) => !currentPlayerIds.has(playerId)
    );

    if (newPlayerIds.length === 0) {
      throw new Error(
        "Visi izvēlētie spēlētāji jau piedalās turnīrā."
      );
    }

    const addedParticipants =
      await this.participantRepository.addMany(
        group.id,
        newPlayerIds
      );

    if (existingMatches.length === 0) {
      return {
        addedParticipantsCount: addedParticipants.length,
        createdMatchesCount: 0,
      };
    }

    const allPlayerIds = [
      ...currentParticipants.map(
        (participant) => participant.player_id
      ),
      ...newPlayerIds,
    ];

    const existingPairKeys = new Set(
      existingMatches.map((match) =>
        this.createPairKey(
          match.player_one_id,
          match.player_two_id
        )
      )
    );

    const newPlayerIdSet = new Set(newPlayerIds);

    const missingPairs: Array<{
      playerOneId: string;
      playerTwoId: string;
    }> = [];

    for (
      let playerOneIndex = 0;
      playerOneIndex < allPlayerIds.length;
      playerOneIndex += 1
    ) {
      for (
        let playerTwoIndex = playerOneIndex + 1;
        playerTwoIndex < allPlayerIds.length;
        playerTwoIndex += 1
      ) {
        const playerOneId =
          allPlayerIds[playerOneIndex];

        const playerTwoId =
          allPlayerIds[playerTwoIndex];

        const involvesNewPlayer =
          newPlayerIdSet.has(playerOneId) ||
          newPlayerIdSet.has(playerTwoId);

        if (!involvesNewPlayer) {
          continue;
        }

        const pairKey = this.createPairKey(
          playerOneId,
          playerTwoId
        );

        if (existingPairKeys.has(pairKey)) {
          continue;
        }

        missingPairs.push({
          playerOneId,
          playerTwoId,
        });
      }
    }

    if (missingPairs.length === 0) {
      return {
        addedParticipantsCount: addedParticipants.length,
        createdMatchesCount: 0,
      };
    }

    const highestRoundNumber = existingMatches.reduce(
      (highestRound, match) =>
        Math.max(
          highestRound,
          match.round_number ?? 0
        ),
      0
    );

    const highestMatchNumber = existingMatches.reduce(
      (highestMatch, match) =>
        Math.max(
          highestMatch,
          match.match_number ?? 0
        ),
      0
    );

    const newMatches: MatchInsert[] = missingPairs.map(
      (pair, index) => ({
        tournament_id: normalizedTournamentId,
        group_id: group.id,
        player_one_id: pair.playerOneId,
        player_two_id: pair.playerTwoId,
        status: "unscheduled",
        round_number: highestRoundNumber + index + 1,
        match_number: highestMatchNumber + index + 1,
      })
    );

    const createdMatches =
      await this.matchRepository.createMany(newMatches);

    return {
      addedParticipantsCount: addedParticipants.length,
      createdMatchesCount: createdMatches.length,
    };
  }

  async removeParticipant(
    tournamentId: string,
    playerId: string
  ) {
    const normalizedTournamentId = tournamentId.trim();
    const normalizedPlayerId = playerId.trim();

    if (!normalizedPlayerId) {
      throw new Error("Spēlētāja ID nav norādīts.");
    }

    const group = await this.requireMainGroup(
      normalizedTournamentId
    );

    const existingMatches =
      await this.matchRepository.getByTournamentId(
        normalizedTournamentId
      );

    if (existingMatches.length > 0) {
      throw new Error(
        "Pēc spēļu izveidošanas dalībnieku no turnīra vairs nevar noņemt."
      );
    }

    const removedMembership =
      await this.participantRepository.removeActiveMembership(
        group.id,
        normalizedPlayerId
      );

    if (!removedMembership) {
      throw new Error(
        "Spēlētājs nav aktīvs šī turnīra dalībnieks."
      );
    }

    return removedMembership;
  }

  private createPairKey(
    playerOneId: string,
    playerTwoId: string
  ) {
    return [playerOneId, playerTwoId]
      .sort()
      .join(":");
  }
}