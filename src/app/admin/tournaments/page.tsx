import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createTournamentService } from "@/services/createTournamentService";

const statusLabels: Record<string, string> = {
  draft: "Melnraksts",
  active: "Aktīvs",
  completed: "Pabeigts",
  archived: "Arhivēts",
};

type AdminTournamentsPageProps = {
  searchParams: Promise<{ success?: string }>;
};

export default async function AdminTournamentsPage({
  searchParams,
}: AdminTournamentsPageProps) {
  const { success } = await searchParams;
  const tournamentService = await createTournamentService();
  const tournaments = await tournamentService.getTournaments();

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">
            BTK administrācija
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Turnīri
          </h1>
        </div>

        <Link
          href="/admin/tournaments/new"
          className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--btk-primary)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Jauns turnīrs
        </Link>
      </div>

      {success && (
        <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          {success}
        </p>
      )}

      {tournaments.length === 0 ? (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Vēl nav neviena turnīra
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Izveido pirmo turnīru un piesaisti to kādai sezonai.
          </p>

          <Link
            href="/admin/tournaments/new"
            className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            Izveidot turnīru
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold text-black">
                      {tournament.name}
                    </h2>

                    <Badge>
                      {statusLabels[tournament.status] ??
                        tournament.status}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-neutral-500">
                    {tournament.season?.name ??
                      "Sezona nav norādīta"}
                  </p>

                  <p className="mt-3 text-xs text-neutral-400">
                    Uzvara: {tournament.points_for_win} p. ·
                    Zaudējums: {tournament.points_for_loss} p.
                  </p>
                </div>

                <Link
                  href={`/admin/tournaments/${tournament.id}`}
                  className="shrink-0 text-sm font-semibold text-[var(--btk-primary)]"
                >
                  Atvērt
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
