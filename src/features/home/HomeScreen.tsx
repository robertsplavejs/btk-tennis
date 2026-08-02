import { ClubNewsCard } from "./ClubNewsCard";
import { NextMatchCard } from "./NextMatchCard";
import { PendingResultCard } from "./PendingResultCard";
import { PlayerSummaryCard } from "./PlayerSummaryCard";

export function HomeScreen() {
  return (
    <div className="space-y-4 p-4">
      <PlayerSummaryCard />
      <NextMatchCard />
      <PendingResultCard />
      <ClubNewsCard />
    </div>
  );
}