import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { MatchCardEditor } from "@/features/match/MatchCardEditor";
import { createMatchService } from "@/services/createMatchService";
import type { TournamentMatch } from "@/types/match";

type MatchCardPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchCardPage({
  params,
}: MatchCardPageProps) {
  const { matchId } = await params;
  const matchService = await createMatchService();
  const storedMatch = await matchService.getMatchById(matchId);

  if (
    !storedMatch ||
    !storedMatch.player_one ||
    !storedMatch.player_two
  ) {
    notFound();
  }

  const match: TournamentMatch = {
    id: storedMatch.id,
    tournamentId: storedMatch.tournament_id,
    groupId: storedMatch.group_id,
    playerOne: {
      id: storedMatch.player_one.id,
      name: storedMatch.player_one.full_name,
      avatarUrl: storedMatch.player_one.avatar_url ?? undefined,
    },
    playerTwo: {
      id: storedMatch.player_two.id,
      name: storedMatch.player_two.full_name,
      avatarUrl: storedMatch.player_two.avatar_url ?? undefined,
    },
    status:
      storedMatch.status === "completed" ||
      storedMatch.status === "scheduled" ||
      storedMatch.status === "cancelled"
        ? storedMatch.status
        : "unscheduled",
    resultType:
      storedMatch.result_type === "walkover" ||
      storedMatch.result_type === "retired"
        ? storedMatch.result_type
        : "regular",
    scheduledAt: storedMatch.scheduled_at ?? undefined,
    court: storedMatch.court ?? undefined,
    location: storedMatch.location ?? undefined,
    winnerId: storedMatch.winner_id ?? undefined,
    notes: storedMatch.notes ?? undefined,
    createdAt: storedMatch.created_at,
    updatedAt: storedMatch.updated_at,
    sets: storedMatch.sets.map((set) => ({
      playerOneGames: set.player_one_score,
      playerTwoGames: set.player_two_score,
      setType:
        set.set_type === "match_tiebreak"
          ? "match_tiebreak"
          : "regular",
      tiebreak:
        set.player_one_tiebreak_points !== null &&
        set.player_two_tiebreak_points !== null
          ? {
              playerOnePoints: set.player_one_tiebreak_points,
              playerTwoPoints: set.player_two_tiebreak_points,
            }
          : undefined,
    })),
  };

  if (storedMatch.status !== "completed") {
    return (
      <div className="space-y-4 p-4">
        <div>
          <p className="text-sm text-neutral-500">Match Card</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Karte vēl nav pieejama
          </h1>
        </div>

        <Card className="p-5">
          <p className="text-sm leading-6 text-neutral-500">
            Match Card var izveidot tikai pēc spēles rezultāta ievadīšanas.
          </p>

          <Link
            href={`/matches/${match.id}`}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Atgriezties pie spēles
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-neutral-500">
          Dalies ar rezultātu
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Match Card
        </h1>
      </div>

      <MatchCardEditor match={match} />
    </div>
  );
}
