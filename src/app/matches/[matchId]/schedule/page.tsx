import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { getDemoMatchById } from "@/data/demo";
import { MatchScheduleForm } from "@/features/match/MatchScheduleForm";
import { canManageMatch } from "@/lib/canManageMatch";

type MatchSchedulePageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

const demoCurrentUser = {
  id: "player-3",
  isAdmin: false,
};

export default async function MatchSchedulePage({
  params,
}: MatchSchedulePageProps) {
  const { matchId } = await params;
  const match = getDemoMatchById(matchId);

  if (!match) {
    notFound();
  }

  const canEdit = canManageMatch({
    match,
    userId: demoCurrentUser.id,
    isAdmin: demoCurrentUser.isAdmin,
  });

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-neutral-500">
          {match.playerOne.name} pret {match.playerTwo.name}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          {match.status === "scheduled"
            ? "Pārcelt spēli"
            : "Pievienot spēles laiku"}
        </h1>
      </div>

      {canEdit ? (
        <MatchScheduleForm match={match} />
      ) : (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Spēles laiku mainīt nevar
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Spēles laiku drīkst mainīt tikai viens no spēles dalībniekiem vai administrators.
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