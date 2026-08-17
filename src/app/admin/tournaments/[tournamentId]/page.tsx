import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { createMatchService } from "@/services/createMatchService";
import { createParticipantService } from "@/services/createParticipantService";
import { createTournamentService } from "@/services/createTournamentService";

import { generateMatches } from "./actions";

type AdminTournamentPageProps = {
  params: Promise<{
    tournamentId: string;
  }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  draft: "Melnraksts",
  active: "Aktīvs",
  completed: "Pabeigts",
  archived: "Arhivēts",
};

export default async function AdminTournamentPage({
  params,
  searchParams,
}: AdminTournamentPageProps) {
  const { tournamentId } = await params;
  const { error, success } = await searchParams;

  const tournamentService = await createTournamentService();
  const participantService = await createParticipantService();
  const matchService = await createMatchService();

  let tournament;

  try {
    tournament =
      await tournamentService.getTournamentById(tournamentId);
  } catch {
    notFound();
  }

  const [participants, matches] = await Promise.all([
    participantService.getParticipants(tournamentId),
    matchService.getMatches(tournamentId),
  ]);

  const completedMatches = matches.filter(
    (match) => match.status === "completed"
  ).length;

  const scheduledMatches = matches.filter(
    (match) => match.status === "scheduled"
  ).length;

  const unscheduledMatches = matches.filter(
    (match) => match.status === "unscheduled"
  ).length;

  const matchesGenerated = matches.length > 0;
  const hasEnoughParticipants = participants.length >= 2;

  const completionPercentage =
    matches.length > 0
      ? Math.round((completedMatches / matches.length) * 100)
      : 0;

  const generateMatchesForTournament =
    generateMatches.bind(null, tournamentId);

  return (
    <div className="space-y-4 p-4">
      <header>
        <Link
          href="/admin/tournaments"
          className="text-sm font-medium text-neutral-500 transition hover:text-black"
        >
          ← Atpakaļ uz turnīriem
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="text-sm text-neutral-500">
            BTK administrācija
          </p>

          <Badge>
            {statusLabels[tournament.status] ??
              tournament.status}
          </Badge>
        </div>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
          {tournament.name}
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Turnīra vadības centrs
        </p>
      </header>

      {success && (
        <p
          className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
          role="status"
        >
          {success}
        </p>
      )}

      {error && (
        <p
          className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <Card className="p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Turnīra progress
            </p>

            <p className="mt-1 text-3xl font-bold text-black">
              {completionPercentage}%
            </p>
          </div>

          <p className="text-right text-sm text-neutral-500">
            {completedMatches} no {matches.length} spēlēm
            pabeigtas
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-[var(--btk-primary)] transition-all"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Link
          href={`/admin/tournaments/${tournament.id}/participants`}
          className="block"
        >
          <Card className="h-full p-4 transition hover:border-black/10">
            <p className="text-xs font-medium text-neutral-500">
              Dalībnieki
            </p>

            <p className="mt-2 text-2xl font-bold text-black">
              {participants.length}
            </p>

            <p className="mt-2 text-xs font-semibold text-[var(--btk-primary)]">
              Pārvaldīt
            </p>
          </Card>
        </Link>

        <Link
          href={`/admin/tournaments/${tournament.id}/matches`}
          className="block"
        >
          <Card className="h-full p-4 transition hover:border-black/10">
            <p className="text-xs font-medium text-neutral-500">
              Spēles
            </p>

            <p className="mt-2 text-2xl font-bold text-black">
              {matches.length}
            </p>

            <p className="mt-2 text-xs font-semibold text-[var(--btk-primary)]">
              Atvērt
            </p>
          </Card>
        </Link>

        <Link
          href={`/admin/tournaments/${tournament.id}/standings`}
          className="block"
        >
          <Card className="h-full p-4 transition hover:border-black/10">
            <p className="text-xs font-medium text-neutral-500">
              Tabula
            </p>

            <p className="mt-2 text-2xl font-bold text-black">
              {participants.length}
            </p>

            <p className="mt-2 text-xs font-semibold text-[var(--btk-primary)]">
              Skatīt
            </p>
          </Card>
        </Link>
      </div>

      {matchesGenerated && (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-black">
            Spēļu statuss
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-neutral-50 p-4 text-center">
              <p className="text-2xl font-bold text-black">
                {unscheduledMatches}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Nav ieplānotas
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 text-center">
              <p className="text-2xl font-bold text-black">
                {scheduledMatches}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                Ieplānotas
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4 text-center">
              <p className="text-2xl font-bold text-green-700">
                {completedMatches}
              </p>

              <p className="mt-1 text-xs text-green-700">
                Pabeigtas
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Nākamā darbība
        </p>

        {!hasEnoughParticipants && (
          <>
            <h2 className="mt-2 text-lg font-semibold text-black">
              Pievieno dalībniekus
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Spēļu ģenerēšanai turnīrā nepieciešami vismaz divi
              dalībnieki.
            </p>

            <Link
              href={`/admin/tournaments/${tournament.id}/participants`}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
            >
              Pārvaldīt dalībniekus
            </Link>
          </>
        )}

        {hasEnoughParticipants && !matchesGenerated && (
          <>
            <h2 className="mt-2 text-lg font-semibold text-black">
              Ģenerē turnīra spēles
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Dalībnieki ir gatavi. Sistēma automātiski izveidos
              Round Robin spēles, kur katrs spēlēs ar katru.
            </p>

            <form action={generateMatchesForTournament}>
              <button
                type="submit"
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
              >
                Ģenerēt spēles
              </button>
            </form>
          </>
        )}

        {matchesGenerated && unscheduledMatches > 0 && (
          <>
            <h2 className="mt-2 text-lg font-semibold text-black">
              Ieplāno spēles
            </h2>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {unscheduledMatches} spēlēm vēl nav norādīts datums,
              laiks un korts.
            </p>

            <Link
              href={`/admin/tournaments/${tournament.id}/matches`}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
            >
              Atvērt spēļu sarakstu
            </Link>
          </>
        )}

        {matchesGenerated &&
          unscheduledMatches === 0 &&
          completedMatches < matches.length && (
            <>
              <h2 className="mt-2 text-lg font-semibold text-black">
                Turpini turnīru
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Visas spēles ir ieplānotas. Pēc spēļu izspēlēšanas
                ievadi rezultātus.
              </p>

              <Link
                href={`/admin/tournaments/${tournament.id}/matches`}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
              >
                Atvērt spēles
              </Link>
            </>
          )}

        {matchesGenerated &&
          completedMatches === matches.length && (
            <>
              <h2 className="mt-2 text-lg font-semibold text-black">
                Turnīra spēles pabeigtas
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Visi rezultāti ir ievadīti. Apskati gala turnīra
                tabulu.
              </p>

              <Link
                href={`/admin/tournaments/${tournament.id}/standings`}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
              >
                Skatīt gala tabulu
              </Link>
            </>
          )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-black">
              Turnīra iestatījumi
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              Uzvara {tournament.points_for_win} p. · Zaudējums{" "}
              {tournament.points_for_loss} p.
            </p>
          </div>

          <Link
            href={`/admin/tournaments/${tournament.id}/edit`}
            className="shrink-0 text-sm font-semibold text-[var(--btk-primary)]"
          >
            Rediģēt
          </Link>
        </div>
      </Card>
    </div>
  );
}