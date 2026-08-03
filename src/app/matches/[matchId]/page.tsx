import { notFound } from "next/navigation";

import { demoMatches, getDemoMatchById } from "@/data/demo";
import { MatchActionsCard } from "@/features/match/MatchActionsCard";
import { MatchFormComparison } from "@/features/match/MatchFormComparison";
import { MatchHeadToHead } from "@/features/match/MatchHeadToHead";
import { MatchHero } from "@/features/match/MatchHero";
import { MatchInsightCard } from "@/features/match/MatchInsightCard";

type MatchDetailsPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchDetailsPage({
  params,
}: MatchDetailsPageProps) {
  const { matchId } = await params;
  const match = getDemoMatchById(matchId);

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-neutral-500">Spēles detaļas</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Mačs
        </h1>
      </div>

      <MatchHero match={match} />

      <MatchInsightCard match={match} />

      <MatchFormComparison
        playerOne={match.playerOne}
        playerTwo={match.playerTwo}
      />

      <MatchHeadToHead
        currentMatch={match}
        allMatches={demoMatches}
      />

      <MatchActionsCard match={match} />
    </div>
  );
}