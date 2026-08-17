import { generateRoundRobinPairs } from "@/lib/generateRoundRobinPairs";
import { validateMatchSet } from "@/lib/validateMatchSet";
import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import type { Database } from "@/types/database";

type MatchInsert =
  Database["public"]["Tables"]["matches"]["Insert"];

type MatchSetInsert =
  Database["public"]["Tables"]["match_sets"]["Insert"];

type SaveMatchResultInput = {
  matchId: string;
  enteredByUserId: string;
  sets: Array<{
    playerOneScore: number;
    playerTwoScore: number;
    setType?: string;
    playerOneTiebreakPoints?: number | null;
    playerTwoTiebreakPoints?: number | null;
  }>;
};

type SaveWalkoverInput = {
  matchId: string;
  enteredByUserId: string;
  winnerId: string;
};

export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async getMatchById(matchId: string) {
    const normalizedMatchId = matchId.trim();

    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    return this.matchRepository.getById(normalizedMatchId);
  }

  async getMatches(tournamentId: string) {
    const normalizedTournamentId = tournamentId.trim();

    if (!normalizedTournamentId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    return this.matchRepository.getByTournamentId(
      normalizedTournamentId
    );
  }

  async generateMatches(tournamentId: string) {
    const normalizedTournamentId = tournamentId.trim();

    if (!normalizedTournamentId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    const existingMatches = await this.getMatches(
      normalizedTournamentId
    );

    if (existingMatches.length > 0) {
      throw new Error(
        "Šim turnīram spēles jau ir izveidotas."
      );
    }

    const group =
      await this.participantRepository.getMainGroupByTournamentId(
        normalizedTournamentId
      );

    if (!group) {
      throw new Error(
        "Turnīram nav atrasta galvenā grupa."
      );
    }

    const participants =
      await this.participantRepository.getByGroupId(group.id);

    if (participants.length < 2) {
      throw new Error(
        "Spēļu ģenerēšanai nepieciešami vismaz 2 dalībnieki."
      );
    }

    const pairs = generateRoundRobinPairs(
      participants.map(
        (participant) => participant.player_id
      )
    );

    const matches: MatchInsert[] = pairs.map(
      (pair, index) => ({
        tournament_id: normalizedTournamentId,
        group_id: group.id,
        player_one_id: pair.playerOneId,
        player_two_id: pair.playerTwoId,
        status: "unscheduled",
        result_type: "regular",
        round_number: pair.roundNumber,
        match_number: index + 1,
      })
    );

    return this.matchRepository.createMany(matches);
  }

  async saveResult(input: SaveMatchResultInput) {
    const matchId = input.matchId.trim();
    const enteredByUserId = input.enteredByUserId.trim();

    if (!matchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    if (!enteredByUserId) {
      throw new Error("Rezultāta ievadītājs nav norādīts.");
    }

    const match = await this.matchRepository.getById(matchId);

    if (!match) {
      throw new Error("Spēle nav atrasta.");
    }

    if (
      match.status !== "scheduled" &&
      match.status !== "completed"
    ) {
      throw new Error(
        "Rezultātu var ievadīt tikai ieplānotai vai pabeigtai spēlei."
      );
    }

    if (input.sets.length < 2 || input.sets.length > 3) {
      throw new Error(
        "Spēles rezultātā jābūt diviem vai trim setiem."
      );
    }

    let playerOneSetWins = 0;
    let playerTwoSetWins = 0;

    const sets: MatchSetInsert[] = input.sets.map(
      (set, index) => {
        if (
          !Number.isInteger(set.playerOneScore) ||
          !Number.isInteger(set.playerTwoScore) ||
          set.playerOneScore < 0 ||
          set.playerTwoScore < 0
        ) {
          throw new Error(
            `${index + 1}. setam norādīts nederīgs rezultāts.`
          );
        }

        const validationSetType =
          set.setType === "match-tiebreak"
            ? "match-tiebreak"
            : "regular";
        const validation = validateMatchSet(
          {
            playerOneGames: set.playerOneScore,
            playerTwoGames: set.playerTwoScore,
          },
          validationSetType
        );

        if (!validation.valid) {
          throw new Error(
            `${index + 1}. sets: ${validation.message}`
          );
        }

        if (set.playerOneScore > set.playerTwoScore) {
          playerOneSetWins += 1;
        } else {
          playerTwoSetWins += 1;
        }

        return {
          match_id: matchId,
          set_number: index + 1,
          set_type:
            validationSetType === "match-tiebreak"
              ? "match_tiebreak"
              : "regular",
          player_one_score: set.playerOneScore,
          player_two_score: set.playerTwoScore,
          player_one_tiebreak_points:
            set.playerOneTiebreakPoints ?? null,
          player_two_tiebreak_points:
            set.playerTwoTiebreakPoints ?? null,
        };
      }
    );

    const firstTwoHaveSameWinner =
      (input.sets[0].playerOneScore > input.sets[0].playerTwoScore) ===
      (input.sets[1].playerOneScore > input.sets[1].playerTwoScore);

    if (firstTwoHaveSameWinner && input.sets.length !== 2) {
      throw new Error(
        "Pēc uzvaras pirmajos divos setos trešais sets netiek spēlēts."
      );
    }

    if (!firstTwoHaveSameWinner && input.sets.length !== 3) {
      throw new Error(
        "Pie rezultāta 1:1 nepieciešams trešais sets vai mača taibreiks."
      );
    }

    if (
      playerOneSetWins < 2 &&
      playerTwoSetWins < 2
    ) {
      throw new Error(
        "No ievadītā rezultāta nevar noteikt spēles uzvarētāju."
      );
    }

    await this.matchRepository.saveResultAtomically(
      matchId,
      sets
    );

    return this.matchRepository.getById(matchId);
  }

  async saveWalkover(input: SaveWalkoverInput) {
    const matchId = input.matchId.trim();
    const enteredByUserId = input.enteredByUserId.trim();
    const winnerId = input.winnerId.trim();

    if (!matchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    if (!enteredByUserId) {
      throw new Error(
        "Tehniskās uzvaras ievadītājs nav norādīts."
      );
    }

    if (!winnerId) {
      throw new Error("Uzvarētājs nav norādīts.");
    }

    const match = await this.matchRepository.getById(matchId);

    if (!match) {
      throw new Error("Spēle nav atrasta.");
    }

    const isMatchPlayer =
      winnerId === match.player_one_id ||
      winnerId === match.player_two_id;

    if (!isMatchPlayer) {
      throw new Error(
        "Tehnisko uzvaru var piešķirt tikai vienam no spēles dalībniekiem."
      );
    }

    await this.matchRepository.saveWalkoverAtomically(
      matchId,
      winnerId
    );

    return this.matchRepository.getById(matchId);
  }
}
