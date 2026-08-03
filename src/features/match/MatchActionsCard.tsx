import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { TournamentMatch } from "@/types/match";

type MatchActionsCardProps = {
  match: TournamentMatch;
};

export function MatchActionsCard({
  match,
}: MatchActionsCardProps) {
  if (match.status === "cancelled") {
    return (
      <Card className="p-5">
        <p className="text-sm text-neutral-500">
          Šai spēlei pašlaik nav pieejamu darbību.
        </p>
      </Card>
    );
  }

  if (match.status === "completed") {
    return (
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Nākamā darbība
        </p>

        <h2 className="mt-2 text-lg font-semibold text-black">
          Padalies ar spēles rezultātu
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Izveido vizuālu Match Card, ko vēlāk varēsi saglabāt vai publicēt.
        </p>

        <Link
          href={`/matches/${match.id}/card`}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Izveidot Match Card
        </Link>
      </Card>
    );
  }

  if (match.status === "unscheduled") {
    return (
      <Card className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          Nākamā darbība
        </p>

        <h2 className="mt-2 text-lg font-semibold text-black">
          Vienojies par spēles laiku
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Sazinies ar pretinieku un pēc tam pievieno saskaņoto laiku.
        </p>

        <Link
          href={`/matches/${match.id}/schedule`}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Pievienot spēles laiku
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
        Darbības
      </p>

      <h2 className="mt-2 text-lg font-semibold text-black">
        Pārvaldi šo spēli
      </h2>

      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Pēc spēles ievadi rezultātu. Ja saskaņotais laiks mainās, pārcel spēli.
      </p>

      <div className="mt-5 space-y-3">
        <Link
          href={`/matches/${match.id}/result`}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--btk-primary)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btk-primary-hover)]"
        >
          Ievadīt rezultātu
        </Link>

        <Link
          href={`/matches/${match.id}/schedule`}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          Pārcelt spēli
        </Link>
      </div>
    </Card>
  );
}