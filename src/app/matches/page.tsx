import { demoMatches } from "@/data/demo";
import { MatchCalendar } from "@/features/tournament/MatchCalendar";

export default function MatchesPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-neutral-500">Tavas turnīra spēles</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Spēles
        </h1>
      </div>

      <MatchCalendar
        matches={demoMatches}
        currentPlayerId="player-3"
      />
    </div>
  );
}