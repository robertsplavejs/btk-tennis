import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { getDemoMatchById } from "@/data/demo";
import { MatchCardEditor } from "@/features/match/MatchCardEditor";

type MatchCardPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchCardPage({
  params,
}: MatchCardPageProps) {
  const { matchId } = await params;
  const match = getDemoMatchById(matchId);

  if (!match) {
    notFound();
  }

  if (match.status !== "completed") {
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