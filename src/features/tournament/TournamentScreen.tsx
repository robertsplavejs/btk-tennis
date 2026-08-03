import { demoMatches, demoStandings } from "@/data/demo";

import { MatchCalendar } from "./MatchCalendar";
import { StandingsTable } from "./StandingsTable";
import { TournamentHeader } from "./TournamentHeader";
import { TournamentTabs } from "./TournamentTabs";

export function TournamentScreen() {
  return (
    <div className="space-y-4 p-4">
      <TournamentHeader
        tournament="BTK Summer League"
        group="Vīrieši A"
        position={3}
        points={42}
        played={18}
        totalMatches={22}
        positionChange={1}
      />

      <TournamentTabs
        standingsContent={
          <StandingsTable
            standings={demoStandings}
            currentPlayerId="player-3"
          />
        }
        matchesContent={
          <MatchCalendar
            matches={demoMatches}
            currentPlayerId="player-3"
          />
        }
        statisticsContent={
          <div className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <p className="text-sm text-neutral-500">
              Statistikas sadaļu pievienosim nākamajā posmā.
            </p>
          </div>
        }
      />
    </div>
  );
}