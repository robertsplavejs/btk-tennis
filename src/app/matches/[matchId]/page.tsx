import { MatchScreen } from "@/features/match/MatchScreen";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchPage({
  params,
}: MatchPageProps) {
  const { matchId } = await params;

  return <MatchScreen matchId={matchId} />;
}