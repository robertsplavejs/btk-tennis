import { redirect } from "next/navigation";

import {
  MatchesScreen,
  type MatchesPageData,
} from "@/features/match/MatchesScreen";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createPlayerService } from "@/services/createPlayerService";
import { createTournamentViewService } from "@/services/createTournamentViewService";
import type { TournamentView } from "@/services/TournamentViewService";
import type { TournamentMatch } from "@/types/match";

function getOpponent(match: TournamentMatch, playerId: string) {
  return match.playerOne.id === playerId
    ? match.playerTwo
    : match.playerOne;
}

function getMatchDate(match: TournamentMatch) {
  return (
    match.updatedAt ??
    match.scheduledAt ??
    match.createdAt ??
    new Date(0).toISOString()
  );
}

function createMatchesPageData(
  view: TournamentView,
  player: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  }
): MatchesPageData {
  const playerId = player.id;
  const playerMatches = view.matches.filter(
    (match) =>
      match.playerOne.id === playerId ||
      match.playerTwo.id === playerId
  );
  const completed = playerMatches
    .filter((match) => match.status === "completed")
    .sort((first, second) =>
      getMatchDate(second).localeCompare(getMatchDate(first))
    );
  const scheduled = playerMatches
    .filter(
      (match) =>
        match.status === "scheduled" && match.scheduledAt
    )
    .sort(
      (first, second) =>
        new Date(first.scheduledAt ?? 0).getTime() -
        new Date(second.scheduledAt ?? 0).getTime()
    );
  const standingByPlayerId = new Map(
    view.standings.map((standing) => [standing.playerId, standing])
  );
  const nextMatch = scheduled.find(
    (match) =>
      new Date(match.scheduledAt ?? 0).getTime() > Date.now()
  );

  return {
    tournamentName: view.tournament.name,
    groupName: view.tournament.groupName,
    totalMatches: playerMatches.length,
    playedMatches: completed.length,
    currentPlayer: {
      id: player.id,
      name: player.full_name,
      avatarUrl: player.avatar_url ?? undefined,
    },
    nextMatch: nextMatch
      ? (() => {
          const opponent = getOpponent(nextMatch, playerId);
          const opponentStanding = standingByPlayerId.get(opponent.id);

          return {
            id: nextMatch.id,
            opponent,
            startsAt: nextMatch.scheduledAt!,
            court: nextMatch.court ?? "Korts nav norādīts",
            opponentStats: opponentStanding
              ? {
                  ranking: opponentStanding.position,
                  record: `${opponentStanding.wins}–${opponentStanding.losses}`,
                  points: opponentStanding.points,
                }
              : undefined,
          };
        })()
      : undefined,
    scheduledMatches: scheduled.map((match) => ({
      id: match.id,
      opponent: getOpponent(match, playerId),
      startsAt: match.scheduledAt!,
      court: match.court ?? "Korts nav norādīts",
    })),
    pendingMatches: playerMatches
      .filter((match) => match.status === "unscheduled")
      .map((match) => ({
        id: match.id,
        opponent: getOpponent(match, playerId),
      })),
    completedMatches: completed.map((match) => {
      const isPlayerOne = match.playerOne.id === playerId;
      const currentPlayer = isPlayerOne
        ? match.playerOne
        : match.playerTwo;
      const opponent = getOpponent(match, playerId);

      return {
        id: match.id,
        player: currentPlayer,
        opponent,
        playedAt: getMatchDate(match),
        court: match.court ?? "",
        score: (match.sets ?? []).map((set) =>
          isPlayerOne
            ? `${set.playerOneGames}:${set.playerTwoGames}`
            : `${set.playerTwoGames}:${set.playerOneGames}`
        ),
        setTypes: (match.sets ?? []).map(
          (set) => set.setType ?? "regular"
        ),
        result: match.winnerId === playerId ? "win" : "loss",
      };
    }),
  };
}

type MatchesPageProps = {
  searchParams: Promise<{ filter?: string | string[] }>;
};

export default async function MatchesPage({
  searchParams,
}: MatchesPageProps) {
  const { filter } = await searchParams;
  const requestedFilter = Array.isArray(filter)
    ? filter[0]
    : filter;
  const activeFilter =
    requestedFilter === "unscheduled" ||
    requestedFilter === "scheduled" ||
    requestedFilter === "completed"
      ? requestedFilter
      : "all";
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.playerId) {
    redirect(identity.isAdmin ? "/admin" : "/");
  }

  const [playerService, tournamentViewService] = await Promise.all([
    createPlayerService(),
    createTournamentViewService(),
  ]);
  const [player, tournamentView] = await Promise.all([
    playerService.getPlayerById(identity.playerId),
    tournamentViewService.getDefaultTournamentView(identity.playerId),
  ]);

  if (!player) {
    throw new Error("Ielogotajam lietotājam nav atrasts spēlētāja profils.");
  }

  if (!tournamentView) {
    return (
      <div className="px-5 py-8 text-center text-sm text-neutral-500">
        Tev pašlaik nav neviena turnīra ar spēlēm.
      </div>
    );
  }

  return (
    <MatchesScreen
      data={createMatchesPageData(tournamentView, player)}
      activeFilter={activeFilter}
    />
  );
}
