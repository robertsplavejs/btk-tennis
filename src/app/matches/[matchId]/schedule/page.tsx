import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { MatchScheduleForm } from "@/features/match/MatchScheduleForm";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchService } from "@/services/createMatchService";
import type { TournamentMatch } from "@/types/match";

type MatchSchedulePageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchSchedulePage({
  params,
}: MatchSchedulePageProps) {
  const { matchId } = await params;

  const matchService = await createMatchService();
  const [match, identity] = await Promise.all([
    matchService.getMatchById(matchId),
    getCurrentIdentity(),
  ]);

  if (!match || !match.player_one || !match.player_two) {
    notFound();
  }

  const isParticipant =
    identity?.playerId === match.player_one_id ||
    identity?.playerId === match.player_two_id;

  const canEdit = Boolean(identity) &&
    (isParticipant || identity?.isAdmin === true);

  const scheduleMatch = {
    id: match.id,
    tournamentId: match.tournament_id,
    groupId: match.group_id,
    playerOne: {
      id: match.player_one.id,
      name: match.player_one.full_name,
      initials: match.player_one.initials ?? undefined,
      avatarUrl: match.player_one.avatar_url ?? undefined,
    },
    playerTwo: {
      id: match.player_two.id,
      name: match.player_two.full_name,
      initials: match.player_two.initials ?? undefined,
      avatarUrl: match.player_two.avatar_url ?? undefined,
    },
    status: match.status,
    scheduledAt: match.scheduled_at ?? undefined,
    court: match.court ?? undefined,
    location: match.location ?? undefined,
    notes: match.notes ?? undefined,
    winnerId: match.winner_id ?? undefined,
    resultEnteredBy: match.result_entered_by ?? undefined,
    sets: [],
  } as TournamentMatch;

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href={`/matches/${match.id}`}
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz spēli
        </Link>

        <p className="mt-5 text-sm text-neutral-500">
          {match.player_one.full_name} pret{" "}
          {match.player_two.full_name}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          {match.status === "scheduled"
            ? "Pārcelt spēli"
            : "Pievienot spēles laiku"}
        </h1>
      </div>

      {canEdit ? (
        <MatchScheduleForm match={scheduleMatch} />
      ) : (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Spēles laiku mainīt nevar
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Spēles laiku drīkst mainīt tikai viens no spēles
            dalībniekiem vai administrators.
          </p>

          <Link
            href={`/matches/${match.id}`}
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Atgriezties pie spēles
          </Link>
        </Card>
      )}
    </div>
  );
}
