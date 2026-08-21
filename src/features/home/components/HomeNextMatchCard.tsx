/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";

type HomeNextMatchCardProps = {
  matchId: string | null;
  opponentName: string | null;
  opponentAvatarUrl?: string | null;
  scheduledAt?: string;
  location?: string | null;
  court?: string | null;
  pendingResultMatchId?: string | null;
  pendingResultOpponentName?: string | null;
  unscheduledMatchCount?: number;
  hasCompletedAllMatches?: boolean;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDayDifference(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const matchDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return Math.round(
    (matchDay.getTime() - today.getTime()) /
      DAY_IN_MS
  );
}

function getTimingBadge(value?: string) {
  const difference = getDayDifference(value);

  if (difference === null) {
    return null;
  }

  if (difference === 0) {
    return {
      label: "ŠODIEN",
      variant: "danger" as const,
    };
  }

  if (difference === 1) {
    return {
      label: "RĪT",
      variant: "warning" as const,
    };
  }

  if (difference > 1) {
    return {
      label: `PĒC ${difference} DIENĀM`,
      variant: "neutral" as const,
    };
  }

  return null;
}

function formatMatchDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    weekday: new Intl.DateTimeFormat("lv-LV", {
      timeZone: "Europe/Riga",
      weekday: "long",
    }).format(date),

    date: new Intl.DateTimeFormat("lv-LV", {
      timeZone: "Europe/Riga",
      day: "numeric",
      month: "long",
    }).format(date),

    time: new Intl.DateTimeFormat("lv-LV", {
      timeZone: "Europe/Riga",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

export function HomeNextMatchCard({
  matchId,
  opponentName,
  opponentAvatarUrl,
  scheduledAt,
  location,
  court,
  pendingResultMatchId,
  pendingResultOpponentName,
  unscheduledMatchCount = 0,
  hasCompletedAllMatches = false,
}: HomeNextMatchCardProps) {
  const timingBadge = getTimingBadge(scheduledAt);
  const formattedDate = formatMatchDate(scheduledAt);

  if (pendingResultMatchId && pendingResultOpponentName) {
    return (
      <Link
        href={`/matches/${pendingResultMatchId}/result`}
        className="block"
        aria-label={`Ievadīt spēles rezultātu pret ${pendingResultOpponentName}`}
      >
        <Card className="relative border-red-200 bg-red-50 px-4 py-3 shadow-[0_5px_18px_rgba(15,23,42,0.045)] transition active:scale-[0.995]">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-base">
              !
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-red-500">
                Nepieciešama darbība
              </p>
              <h2 className="mt-1 text-base font-semibold text-black">
                Ievadi spēles rezultātu
              </h2>
              <p className="mt-1 truncate text-sm text-neutral-600">
                Spēle pret {pendingResultOpponentName}
              </p>
            </div>

            <span className="absolute right-4 top-3.5">
              <ForwardIndicator />
            </span>
          </div>
        </Card>
      </Link>
    );
  }

  if ((!matchId || !opponentName) && unscheduledMatchCount > 0) {
    return (
      <Link
        href="/matches"
        className="block"
        aria-label="Izvēlēties un ieplānot nākamo spēli"
      >
        <Card className="relative px-4 py-3 shadow-[0_5px_18px_rgba(15,23,42,0.045)] transition active:scale-[0.995]">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-base">
              🎾
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400" style={{ color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em" }}>
                Nākamā spēle
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {unscheduledMatchCount === 1
                  ? "Tev ir viena neizspēlēta spēle."
                  : `Izvēlies vienu no ${unscheduledMatchCount} neizspēlētajām spēlēm.`}
              </p>
            </div>

            <span className="absolute right-4 top-3.5">
              <ForwardIndicator />
            </span>
          </div>
        </Card>
      </Link>
    );
  }

  if (!matchId && hasCompletedAllMatches) {
    return null;
  }

  if (!matchId || !opponentName) {
    return (
      <Card className="shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-base">
            🎾
          </div>

          <div className="min-w-0">
            <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400" style={{ color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em" }}>
              Nākamā spēle
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Pašlaik nav ieplānota.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  /*
   * SCHEDULED STATE
   */
  return (
    <Link
      href={`/matches/${matchId}`}
      className="block"
      aria-label={`Atvērt spēli pret ${opponentName}`}
    >
      <Card className="relative min-h-[184px] overflow-hidden border border-black/5 bg-[#f7f8f8] text-[#111827] shadow-[0_7px_22px_rgba(15,23,42,0.07)] transition active:scale-[0.995]">
        <img src="/demo/matches-court.webp" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.11] grayscale" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.98),rgba(255,255,255,.76)),linear-gradient(180deg,rgba(255,255,255,.2),rgba(247,248,248,.82))]" aria-hidden="true" />

        <div className="relative z-10 px-5 py-4">
          <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">
            Nākamā spēle
          </h2>
          <span className="absolute right-4 top-3.5">
            <ForwardIndicator />
          </span>

          <div className="mt-4 flex min-w-0 items-center gap-3.5 pr-8">
            {opponentAvatarUrl ? (
              <img src={opponentAvatarUrl} alt={opponentName} className="h-14 w-14 shrink-0 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-black/5" />
            ) : (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-white bg-[#111827] text-sm font-black text-white shadow-md ring-1 ring-black/5">
                {opponentName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`${opponentName.length > 18 ? "text-[17px]" : "text-[20px]"} line-clamp-2 break-words font-bold leading-[1.08] tracking-tight text-[#111827]`}
                title={opponentName}
              >
                {opponentName}
              </p>
              {timingBadge ? (
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400">{timingBadge.label}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 border-t border-black/10 pb-1 pt-3.5">
            <div className="w-full whitespace-nowrap text-center text-[11px] font-semibold text-neutral-600" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", alignItems: "center" }}>
              <span className="min-w-0 truncate px-1">{formattedDate?.date ?? "Datums nav norādīts"}</span>
              <span className="min-w-0 truncate border-l border-black/5 px-1">{formattedDate?.time ?? "—"}</span>
              <span className="min-w-0 truncate border-l border-black/5 px-1">{location || "Vieta nav norādīta"}</span>
              <span className="min-w-0 truncate border-l border-black/5 px-1">{court || "Korts nav norādīts"}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
