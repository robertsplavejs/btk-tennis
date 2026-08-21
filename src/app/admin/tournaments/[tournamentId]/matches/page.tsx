import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createMatchService } from "@/services/createMatchService";
import { createTournamentService } from "@/services/createTournamentService";

type TournamentMatchesPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;
};

const statusLabels: Record<string, string> = {
  unscheduled: "Nav ieplānota",
  scheduled: "Ieplānota",
  completed: "Pabeigta",
  cancelled: "Atcelta",
};

function formatScheduledAt(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function TournamentMatchesPage({
  params,
}: TournamentMatchesPageProps) {
  const { tournamentId } = await params;

  const matchService = await createMatchService();
  const tournamentService = await createTournamentService();

  const [matches, tournament] = await Promise.all([
    matchService.getMatches(tournamentId),
    tournamentService.getTournamentById(tournamentId),
  ]);

  const completedMatches = matches.filter(
    (match) => match.status === "completed"
  ).length;

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
          Spēles
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Pabeigtas {completedMatches} no {matches.length}
        </p>
      </div>

      {matches.length === 0 ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Spēles vēl nav izveidotas
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Atgriezies turnīra pārskatā un ģenerē Round Robin
            spēles.
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {Array.from(
            new Set(matches.map((match) => match.round_number))
          ).map((roundNumber) => {
            const roundMatches = matches.filter(
              (match) => match.round_number === roundNumber
            );

            return (
              <section key={roundNumber}>
                <div className="mb-3 flex items-center justify-between gap-4 px-1">
                  <h2 className="text-lg font-semibold text-black">
                    {roundNumber}. kārta
                  </h2>

                  <span className="text-sm text-neutral-500">
                    {roundMatches.length} spēles
                  </span>
                </div>

                <div className="space-y-3">
                  {roundMatches.map((match) => {
                    const scheduledAt = formatScheduledAt(
                      match.scheduled_at
                    );

                    const playerOneSetWins =
                      match.sets?.filter(
                        (set) =>
                          set.player_one_score >
                          set.player_two_score
                      ).length ?? 0;

                    const playerTwoSetWins =
                      match.sets?.filter(
                        (set) =>
                          set.player_two_score >
                          set.player_one_score
                      ).length ?? 0;

                    const isCompleted =
                      match.status === "completed";

                    const actionLabel =
                      match.status === "unscheduled"
                        ? "Ieplānot"
                        : match.status === "scheduled"
                          ? "Atvērt spēli"
                          : match.status === "completed"
                            ? "Skatīt rezultātu"
                            : "Atvērt";

                    return (
                      <Card key={match.id} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                            Spēle #{match.match_number ?? "—"}
                          </p>

                          <Badge>
                            {statusLabels[match.status] ??
                              match.status}
                          </Badge>
                        </div>

                        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                          <p
                            className={`min-w-0 break-words text-right text-base font-semibold ${
                              match.winner_id ===
                              match.player_one_id
                                ? "text-black"
                                : "text-neutral-700"
                            }`}
                          >
                            {match.player_one?.full_name ??
                              "Nezināms spēlētājs"}
                          </p>

                          {isCompleted ? (
                            <div className="rounded-xl bg-black px-3 py-2 text-sm font-bold text-white">
                              {playerOneSetWins}:{playerTwoSetWins}
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-neutral-400">
                              VS
                            </span>
                          )}

                          <p
                            className={`min-w-0 break-words text-base font-semibold ${
                              match.winner_id ===
                              match.player_two_id
                                ? "text-black"
                                : "text-neutral-700"
                            }`}
                          >
                            {match.player_two?.full_name ??
                              "Nezināms spēlētājs"}
                          </p>
                        </div>

                        {match.status === "scheduled" && (
                          <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3">
                            <p className="text-sm font-semibold text-black">
                              {scheduledAt ?? "Laiks nav norādīts"}
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                              {[match.location, match.court]
                                .filter(Boolean)
                                .join(" · ") ||
                                "Vieta nav norādīta"}
                            </p>
                          </div>
                        )}

                        {isCompleted &&
                          match.sets &&
                          match.sets.length > 0 && (
                            <p className="mt-4 text-center text-sm font-medium text-neutral-500">
                              {match.sets
                                .map(
                                  (set) =>
                                    `${set.player_one_score}:${set.player_two_score}`
                                )
                                .join(" · ")}
                            </p>
                          )}

                        <Link
                          href={`/matches/${match.id}`}
                          className={`mt-5 flex h-11 w-full items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors ${
                            match.status === "unscheduled"
                              ? "bg-[var(--btk-primary)] text-white hover:bg-[var(--btk-primary-hover)]"
                              : "bg-neutral-100 text-black hover:bg-neutral-200"
                          }`}
                        >
                          {actionLabel}
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}