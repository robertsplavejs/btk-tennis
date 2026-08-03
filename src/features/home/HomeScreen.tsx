import { demoPlayerStatus } from "@/data/demo";

import { NextMatchCard } from "./NextMatchCard";
import { PendingResultCard } from "./PendingResultCard";
import { PlayerStatusCard } from "./PlayerStatusCard";
import { demoActivities } from "@/data/demo";
import { TournamentActivityCard } from "./TournamentActivityCard";
export function HomeScreen() {
  return (
    <div className="space-y-4 p-4">
      <PlayerStatusCard {...demoPlayerStatus} />
      <TournamentActivityCard activities={demoActivities} />
      <NextMatchCard />
      <PendingResultCard />
    </div>
  );
}