import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { createMatchService } from "@/services/createMatchService";
import { createParticipantService } from "@/services/createParticipantService";
import { createTournamentService } from "@/services/createTournamentService";
import {
  StandingEngine,
  type StandingMatch,
  type StandingPlayer,
} from "@/services/StandingEngine";

type TournamentStandingsPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;
};

function normalizeStatus(
  status: string
): StandingMatch["status"] {
  if (
    status === "scheduled" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return status;
  }

  return "unscheduled";
}

function normalizeResultType(
  resultType: string
): StandingMatch["resultType"] {
  if (
    resultType === "walkover" ||
    resultType === "retired"
  ) {
    return resultType;
  }

  return "regular";
}

function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default async function TournamentStandingsPage({
  params,
}: TournamentStandingsPageProps) {
  const { tournamentId } = await params;

  const tournamentService = await createTournamentService();
  const participantService = await createParticipantService();
  const matchService = await createMatchService();

  const [tournament, participants, matches] =
    await Promise.all([
      tournamentService.getTournamentById(tournamentId),
      participantService.getParticipants(tournamentId),
      matchService.getMatches(tournamentId),
    ]);

  const standingPlayers: StandingPlayer[] =
    participants.map((participant) => ({
      playerId: participant.player_id,
      fullName:
        participant.player?.full_name ??
        "Nezināms spēlētājs",
    }));

  const standingMatches: StandingMatch[] =
    matches.map((match) => ({
      id: match.id,
      playerOneId: match.player_one_id,
      playerTwoId: match.player_two_id,
      winnerId: match.winner_id,
      status: normalizeStatus(match.status),
      resultType: normalizeResultType(
        match.result_type
      ),
      completedAt: match.updated_at,
      sets: match.sets.map((set) => ({
        setType: set.set_type,
        playerOneScore: set.player_one_score,
        playerTwoScore: set.player_two_score,
      })),
    }));

  const standingEngine = new StandingEngine({
    winPoints: tournament.points_for_win,
    lossPoints: tournament.points_for_loss,
    unplayedPoints: 0,
  });

  const standings = standingEngine.calculate(
    standingPlayers,
    standingMatches
  );

  return (
    <div className="space-y-4 p-4">
      <div>
        <Link
          href={`/admin/tournaments/${tournamentId}`}
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz turnīru
        </Link>

        <p className="mt-5 text-sm text-neutral-500">
          {tournament.name}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          Turnīra tabula
        </h1>
      </div>

      {standings.length === 0 ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Tabula vēl ir tukša
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Pievieno turnīram dalībniekus, lai izveidotu tabulu.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-neutral-50 text-neutral-500">
                  <th className="px-4 py-3 text-left font-semibold">
                    #
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Spēlētājs
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Sp.
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    U
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Z
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    WO
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Seti
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Setu %
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Geimi
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Geimu %
                  </th>

                  <th className="px-4 py-3 text-center font-semibold">
                    P
                  </th>
                </tr>
              </thead>

              <tbody>
                {standings.map((row) => (
                  <tr
                    key={row.playerId}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-bold text-black">
                      {row.position}
                    </td>

                    <td className="px-4 py-4 font-semibold text-black">
                      {row.fullName}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.matchesPlayed}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.wins}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.losses}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.walkoverWins}:
                      {row.walkoverLosses}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.setsWon}:{row.setsLost}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {formatPercentage(row.setPercentage)}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {row.gamesWon}:{row.gamesLost}
                    </td>

                    <td className="px-3 py-4 text-center text-neutral-600">
                      {formatPercentage(row.gamePercentage)}
                    </td>

                    <td className="px-4 py-4 text-center text-lg font-bold text-black">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-black">
          Tabulas apzīmējumi
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Sp. — spēles, U — uzvaras, Z — zaudējumi,
          WO — tehniskās uzvaras un zaudējumi, P — punkti.
        </p>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Punkti: uzvara {tournament.points_for_win},
          zaudējums {tournament.points_for_loss}.
        </p>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Vienādu punktu gadījumā diviem spēlētājiem
          vispirms vērtē savstarpējās spēles rezultātu. Trīs
          vai vairāk spēlētājiem vērtē setu un pēc tam geimu
          uzvaru procentu.
        </p>
      </Card>
    </div>
  );
}