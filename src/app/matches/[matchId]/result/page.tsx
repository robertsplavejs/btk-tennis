import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { MatchResultForm } from "@/features/match/MatchResultForm";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchService } from "@/services/createMatchService";

type MatchResultPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchResultPage({
  params,
}: MatchResultPageProps) {
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

  const playerOne = {
    id: match.player_one.id,
    name: match.player_one.full_name,
  };

  const playerTwo = {
    id: match.player_two.id,
    name: match.player_two.full_name,
  };

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
          {playerOne.name} pret {playerTwo.name}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Ievadīt rezultātu
        </h1>
      </div>

      {canEdit ? (
        <MatchResultForm
          matchId={match.id}
          playerOne={playerOne}
          playerTwo={playerTwo}
          initialSets={match.sets.map((set) => ({
            playerOneGames: set.player_one_score,
            playerTwoGames: set.player_two_score,
            setType:
              set.set_type === "match_tiebreak"
                ? "match_tiebreak"
                : "regular",
          }))}
        />
      ) : (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Rezultātu ievadīt nevar
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Rezultātu drīkst ievadīt tikai viens no šīs spēles
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
