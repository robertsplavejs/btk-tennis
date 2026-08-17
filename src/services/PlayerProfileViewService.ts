import { PlayerRepository } from "@/repositories/PlayerRepository";
import { TournamentViewService } from "@/services/TournamentViewService";
import type {
  MatchFormResult,
  TournamentMatch,
} from "@/types/match";
import { getPlayerAvatarUrl } from "@/lib/getPlayerAvatarUrl";
import type { ProductInsight } from "@/services/ProductInsightService";
import { ProductInsightService } from "@/services/ProductInsightService";
import { StandingScenarioService } from "@/services/StandingScenarioService";

export type PlayerProfileView = {
  player: {
    id: string;
    fullName: string;
    initials: string;
    avatarUrl: string | null;
    isAdmin: boolean;
  };
  tournament: {
    id: string;
    name: string;
    position: number | null;
    points: number;
    played: number;
    wins: number;
    losses: number;
    totalMatches: number;
    qualificationPlaces: number;
    positionChange: number;
  } | null;
  primaryInsight: ProductInsight | null;
  statistics: {
    wins: number;
    losses: number;
    played: number;
    winPercentage: number;
    currentForm: MatchFormResult[];
    setsWon: number;
    setsLost: number;
    gamesWon: number;
    gamesLost: number;
  };
  nextMatch: TournamentMatch | null;
  pendingResultMatch: TournamentMatch | null;
  unscheduledMatches: TournamentMatch[];
  recentMatches: TournamentMatch[];
};

export class PlayerProfileViewService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly tournamentViewService: TournamentViewService
  ) {}

  async getProfileView(
    playerId: string
  ): Promise<PlayerProfileView> {
    const normalizedPlayerId = playerId.trim();

    if (!normalizedPlayerId) {
      throw new Error("Spēlētāja ID nav norādīts.");
    }

    const player =
      await this.playerRepository.getById(normalizedPlayerId);

    if (!player) {
      throw new PlayerNotFoundError();
    }

    const tournamentView =
      await this.tournamentViewService.getDefaultTournamentView(
        normalizedPlayerId
      );

    const playerMatches =
      tournamentView?.matches.filter(
        (match) =>
          match.playerOne.id === normalizedPlayerId ||
          match.playerTwo.id === normalizedPlayerId
      ) ?? [];

    const completedMatches = playerMatches.filter(
      (match) => match.status === "completed"
    );

    const wins = completedMatches.filter(
      (match) => match.winnerId === normalizedPlayerId
    ).length;

    const losses = completedMatches.length - wins;

    const currentForm: MatchFormResult[] = completedMatches
      .slice()
      .sort((matchOne, matchTwo) => {
        const firstDate =
          matchOne.updatedAt ??
          matchOne.scheduledAt ??
          matchOne.createdAt ??
          "";

        const secondDate =
          matchTwo.updatedAt ??
          matchTwo.scheduledAt ??
          matchTwo.createdAt ??
          "";

        return secondDate.localeCompare(firstDate);
      })
      .slice(0, 5)
      .map((match) =>
        match.winnerId === normalizedPlayerId
          ? "win"
          : "loss"
      );

    const nextMatch =
      playerMatches
        .filter(
          (match) =>
            match.status === "scheduled" &&
            match.scheduledAt !== undefined &&
            new Date(match.scheduledAt).getTime() >
              Date.now()
        )
        .sort((matchOne, matchTwo) => {
          const firstTime = new Date(
            matchOne.scheduledAt ?? ""
          ).getTime();

          const secondTime = new Date(
            matchTwo.scheduledAt ?? ""
          ).getTime();

          return firstTime - secondTime;
        })[0] ?? null;

    const pendingResultMatch =
      playerMatches
        .filter(
          (match) =>
            match.status === "scheduled" &&
            match.scheduledAt !== undefined &&
            new Date(match.scheduledAt).getTime() <=
              Date.now()
        )
        .sort((matchOne, matchTwo) => {
          const firstTime = new Date(
            matchOne.scheduledAt ?? ""
          ).getTime();

          const secondTime = new Date(
            matchTwo.scheduledAt ?? ""
          ).getTime();

          return firstTime - secondTime;
        })[0] ?? null;

    const unscheduledMatches = playerMatches.filter(
      (match) => match.status === "unscheduled"
    );

    const recentMatches = completedMatches
      .slice()
      .sort((matchOne, matchTwo) => {
        const firstDate =
          matchOne.updatedAt ??
          matchOne.scheduledAt ??
          matchOne.createdAt ??
          "";

        const secondDate =
          matchTwo.updatedAt ??
          matchTwo.scheduledAt ??
          matchTwo.createdAt ??
          "";

        return secondDate.localeCompare(firstDate);
      });

    const standing =
      tournamentView?.standings.find(
        (row) => row.playerId === normalizedPlayerId
      ) ?? null;

    const totalMatches =
      tournamentView?.currentPlayer?.totalMatches ??
      Math.max(
        (tournamentView?.standings.length ?? 1) - 1,
        0
      );

    const remainingMatches = Math.max(
      totalMatches - completedMatches.length,
      0
    );

    const scenarioCandidates = [
      ...(nextMatch ? [nextMatch] : []),
      ...unscheduledMatches,
    ];

    const winScenario = tournamentView
      ? new StandingScenarioService().findImprovingWin(
          tournamentView,
          normalizedPlayerId,
          scenarioCandidates
        )
      : null;

    const primaryInsight = new ProductInsightService().getPrimaryInsight({
      position: standing?.position ?? null,
      qualificationPlaces:
        tournamentView?.tournament.qualificationPlaces ?? 0,
      remainingMatches,
      currentForm,
      winScenario,
    });

    return {
      player: {
        id: player.id,
        fullName: player.full_name,
        initials:
          player.initials ??
          this.createInitials(player.full_name),
        avatarUrl:
          getPlayerAvatarUrl(
            player.full_name,
            player.avatar_url
          ) ?? null,
        isAdmin: player.is_admin,
      },
      tournament:
        tournamentView && standing
          ? {
              id: tournamentView.tournament.id,
              name: tournamentView.tournament.name,
              position: standing.position,
              points: standing.points,
              played: standing.matchesPlayed,
              wins: standing.wins,
              losses: standing.losses,
              totalMatches,
              qualificationPlaces:
                tournamentView.tournament.qualificationPlaces,
              positionChange:
                tournamentView.currentPlayer?.positionChange ?? 0,
            }
          : null,
      primaryInsight,
      statistics: {
        wins,
        losses,
        played: completedMatches.length,
        winPercentage:
          completedMatches.length > 0
            ? Math.round(
                (wins / completedMatches.length) * 100
              )
            : 0,
        currentForm,
        setsWon: standing?.setsWon ?? 0,
        setsLost: standing?.setsLost ?? 0,
        gamesWon: standing?.gamesWon ?? 0,
        gamesLost: standing?.gamesLost ?? 0,
      },
      nextMatch,
      pendingResultMatch,
      unscheduledMatches,
      recentMatches,
    };
  }

  private createInitials(fullName: string) {
    return fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }
}

export class PlayerNotFoundError extends Error {
  constructor() {
    super("Spēlētājs nav atrasts.");
    this.name = "PlayerNotFoundError";
  }
}
