import { MatchRepository } from "@/repositories/MatchRepository";
import { ParticipantRepository } from "@/repositories/ParticipantRepository";
import { TournamentRepository } from "@/repositories/TournamentRepository";
import {
  StandingEngine,
  type StandingMatch,
  type StandingPlayer,
  type StandingRow,
} from "@/services/StandingEngine";
import type {
  MatchFormResult,
  MatchStatus,
  TournamentMatch,
} from "@/types/match";
import { getPlayerAvatarUrl } from "@/lib/getPlayerAvatarUrl";

type TournamentStandingRow = StandingRow & {
  previousPosition: number;
  avatarUrl?: string;
};

type TournamentViewPlayer = {
  id: string;
  name: string;
  position: number;
  points: number;
  played: number;
  totalMatches: number;
  positionChange: number;
};

export type TournamentView = {
  tournament: {
    id: string;
    name: string;
    groupName: string;
    status: string;
    qualificationPlaces: number;
    pointsForWin: number;
    pointsForLoss: number;
  };
  currentPlayer: TournamentViewPlayer | null;
  standings: TournamentStandingRow[];
  matches: TournamentMatch[];
  progress: {
    totalMatches: number;
    completedMatches: number;
    scheduledMatches: number;
    unscheduledMatches: number;
    completionPercentage: number;
  };
};

export type TournamentHubView = {
  tournaments: TournamentView[];
};

export class TournamentViewService {
  constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly matchRepository: MatchRepository
  ) {}

  async getDefaultTournamentView(
    currentPlayerId: string | null
  ): Promise<TournamentView | null> {
    if (!currentPlayerId) {
      return null;
    }

    const { tournaments } =
      await this.getTournamentHubView(currentPlayerId);

    return (
      tournaments.find(
        (view) =>
          view.currentPlayer !== null &&
          view.tournament.status === "active"
      ) ??
      tournaments.find(
        (view) =>
          view.currentPlayer !== null &&
          (view.tournament.status === "draft" ||
            view.tournament.status === "upcoming")
      ) ??
      tournaments.find(
        (view) =>
          view.currentPlayer !== null &&
          view.tournament.status === "completed"
      ) ??
      null
    );
  }

  async getTournamentHubView(
    currentPlayerId: string | null
  ): Promise<TournamentHubView> {
    const tournaments =
      await this.tournamentRepository.getAll();

    const views = await Promise.all(
      tournaments.map(async (tournament) => {
        try {
          return await this.getTournamentView(
            tournament.id,
            currentPlayerId
          );
        } catch {
          return null;
        }
      })
    );

    return {
      tournaments: views.filter(
        (view): view is TournamentView => view !== null
      ),
    };
  }

  async getTournamentView(
    tournamentId: string,
    currentPlayerId: string | null
  ): Promise<TournamentView> {
    const normalizedTournamentId = tournamentId.trim();

    if (!normalizedTournamentId) {
      throw new Error("Turnīra ID nav norādīts.");
    }

    const tournament =
      await this.tournamentRepository.getById(
        normalizedTournamentId
      );

    const group =
      await this.participantRepository.getMainGroupByTournamentId(
        normalizedTournamentId
      );

    if (!group) {
      throw new Error(
        "Turnīram nav atrasta galvenā dalībnieku grupa."
      );
    }

    const [participants, matches] = await Promise.all([
      this.participantRepository.getByGroupId(group.id),
      this.matchRepository.getByTournamentId(
        normalizedTournamentId
      ),
    ]);

    const standingPlayers: StandingPlayer[] =
      participants.map((participant) => ({
        playerId: participant.player_id,
        fullName:
          participant.player?.full_name ??
          "Nezināms spēlētājs",
      }));

    const standingMatches: StandingMatch[] =
      matches.map((match) => ({
        id: match.id,
        playerOneId: match.player_one_id,
        playerTwoId: match.player_two_id,
        winnerId: match.winner_id,
        status: this.normalizeStandingStatus(match.status),
        resultType: this.normalizeResultType(
          match.result_type
        ),
        completedAt: match.updated_at,
        sets: match.sets.map((set) => ({
          setType: set.set_type,
          playerOneScore: set.player_one_score,
          playerTwoScore: set.player_two_score,
        })),
      }));

    const standingEngine = new StandingEngine({
      winPoints: tournament.points_for_win,
      lossPoints: tournament.points_for_loss,
      unplayedPoints: 0,
    });

    const calculatedStandings = standingEngine.calculate(
      standingPlayers,
      standingMatches
    );

    const weeklyCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyStandings = standingEngine.calculate(
      standingPlayers,
      standingMatches.filter((match) => {
        if (
          match.status !== "completed" ||
          !match.completedAt
        ) {
          return false;
        }

        const completedAt = new Date(match.completedAt).getTime();

        return (
          Number.isFinite(completedAt) &&
          completedAt <= weeklyCutoff
        );
      })
    );
    const weeklyPositionByPlayerId = new Map(
      weeklyStandings.map((row) => [row.playerId, row.position])
    );

    const standings: TournamentStandingRow[] =
      calculatedStandings.map((row) => ({
        ...row,
        previousPosition:
          weeklyPositionByPlayerId.get(row.playerId) ??
          row.position,
        avatarUrl: getPlayerAvatarUrl(
          row.fullName,
          participants.find(
            (participant) =>
              participant.player_id === row.playerId
          )?.player?.avatar_url
        ),
      }));

    const formByPlayerId = this.createRecentFormMap(
      matches,
      participants.map(
        (participant) => participant.player_id
      )
    );

    const tournamentMatches: TournamentMatch[] =
      matches.map((match) => ({
        id: match.id,
        tournamentId: match.tournament_id,
        groupId: match.group_id,
        playerOne: {
          id: match.player_one_id,
          name:
            match.player_one?.full_name ??
            "Nezināms spēlētājs",
          avatarUrl: getPlayerAvatarUrl(
            match.player_one?.full_name ?? "Nezināms spēlētājs",
            match.player_one?.avatar_url
          ),
          recentForm:
            formByPlayerId.get(match.player_one_id) ?? [],
        },
        playerTwo: {
          id: match.player_two_id,
          name:
            match.player_two?.full_name ??
            "Nezināms spēlētājs",
          avatarUrl: getPlayerAvatarUrl(
            match.player_two?.full_name ?? "Nezināms spēlētājs",
            match.player_two?.avatar_url
          ),
          recentForm:
            formByPlayerId.get(match.player_two_id) ?? [],
        },
        status: this.normalizeMatchStatus(match.status),
        resultType: this.normalizeResultType(match.result_type),
        scheduledAt: match.scheduled_at ?? undefined,
        court: match.court ?? undefined,
        location: match.location ?? undefined,
        sets: match.sets.map((set) => ({
          playerOneGames: set.player_one_score,
          playerTwoGames: set.player_two_score,
          setType:
            set.set_type === "match_tiebreak"
              ? "match_tiebreak"
              : "regular",
          ...(set.player_one_tiebreak_points !== null &&
          set.player_two_tiebreak_points !== null
            ? {
                tiebreak: {
                  playerOnePoints:
                    set.player_one_tiebreak_points,
                  playerTwoPoints:
                    set.player_two_tiebreak_points,
                },
              }
            : {}),
        })),
        winnerId: match.winner_id ?? undefined,
        notes: match.notes ?? undefined,
        createdAt: match.created_at,
        updatedAt: match.updated_at,
      }));

    const totalMatches = tournamentMatches.length;

    const completedMatches = tournamentMatches.filter(
      (match) => match.status === "completed"
    ).length;

    const scheduledMatches = tournamentMatches.filter(
      (match) => match.status === "scheduled"
    ).length;

    const unscheduledMatches = tournamentMatches.filter(
      (match) => match.status === "unscheduled"
    ).length;

    const currentStanding = currentPlayerId
      ? standings.find(
          (standing) =>
            standing.playerId === currentPlayerId
        )
      : undefined;

    const currentPlayer: TournamentViewPlayer | null =
      currentStanding
        ? {
            id: currentStanding.playerId,
            name: currentStanding.fullName,
            position: currentStanding.position,
            points: currentStanding.points,
            played: currentStanding.matchesPlayed,
            totalMatches: Math.max(
              participants.length - 1,
              0
            ),
            positionChange:
              currentStanding.previousPosition -
              currentStanding.position,
          }
        : null;

    return {
      tournament: {
        id: tournament.id,
        name: tournament.name,
        groupName: group.name,
        status: tournament.status,
        qualificationPlaces:
          tournament.qualification_places ?? 8,
        pointsForWin: tournament.points_for_win,
        pointsForLoss: tournament.points_for_loss,
      },
      currentPlayer,
      standings,
      matches: tournamentMatches,
      progress: {
        totalMatches,
        completedMatches,
        scheduledMatches,
        unscheduledMatches,
        completionPercentage:
          totalMatches > 0
            ? Math.round(
                (completedMatches / totalMatches) * 100
              )
            : 0,
      },
    };
  }

  private normalizeMatchStatus(
    status: string
  ): MatchStatus {
    if (
      status === "scheduled" ||
      status === "completed" ||
      status === "cancelled"
    ) {
      return status;
    }

    return "unscheduled";
  }

  private normalizeStandingStatus(
    status: string
  ): StandingMatch["status"] {
    if (
      status === "scheduled" ||
      status === "completed" ||
      status === "cancelled"
    ) {
      return status;
    }

    return "unscheduled";
  }

  private normalizeResultType(
    resultType: string
  ): StandingMatch["resultType"] {
    if (
      resultType === "walkover" ||
      resultType === "retired"
    ) {
      return resultType;
    }

    return "regular";
  }

  private createRecentFormMap(
    matches: Awaited<
      ReturnType<MatchRepository["getByTournamentId"]>
    >,
    playerIds: string[]
  ) {
    const formByPlayerId = new Map<
      string,
      MatchFormResult[]
    >();

    for (const playerId of playerIds) {
      formByPlayerId.set(playerId, []);
    }

    const completedMatches = matches
      .filter(
        (match) =>
          match.status === "completed" &&
          match.winner_id !== null
      )
      .sort((matchOne, matchTwo) =>
        matchOne.updated_at.localeCompare(
          matchTwo.updated_at
        )
      );

    for (const match of completedMatches) {
      const playerOneForm =
        formByPlayerId.get(match.player_one_id) ?? [];

      playerOneForm.push(
        match.winner_id === match.player_one_id
          ? "win"
          : "loss"
      );

      formByPlayerId.set(
        match.player_one_id,
        playerOneForm.slice(-5)
      );

      const playerTwoForm =
        formByPlayerId.get(match.player_two_id) ?? [];

      playerTwoForm.push(
        match.winner_id === match.player_two_id
          ? "win"
          : "loss"
      );

      formByPlayerId.set(
        match.player_two_id,
        playerTwoForm.slice(-5)
      );
    }

    return formByPlayerId;
  }
}
