"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";
import { formatMatchScore } from "@/lib/formatMatchScore";
import type { TournamentMatch } from "@/types/match";

type MatchCalendarProps = {
  matches: TournamentMatch[];
};

type MatchSectionProps = {
  title: string;
  matches: TournamentMatch[];
  variant?: "default" | "featured";
  emptyMessage: string;
  initialLimit?: number;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function PlayerAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ display: "block", width: 30, height: 30, border: "2px solid #fff", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 7px rgba(15,23,42,.12)" }} />;
  }

  return <span style={{ display: "grid", width: 30, height: 30, placeItems: "center", border: "2px solid #fff", borderRadius: "50%", color: "#fff", background: "#111827", fontSize: 8, fontWeight: 900, boxShadow: "0 2px 7px rgba(15,23,42,.12)" }}>{initials(name)}</span>;
}

function FeaturedMatch({ match }: { match: TournamentMatch }) {
  const scheduled = match.scheduledAt ? new Date(match.scheduledAt) : null;
  const validDate = scheduled && !Number.isNaN(scheduled.getTime()) ? scheduled : null;
  const date = validDate ? new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long" }).format(validDate) : "Datums nav norādīts";
  const time = validDate ? new Intl.DateTimeFormat("lv-LV", { hour: "2-digit", minute: "2-digit" }).format(validDate) : "—";

  return (
    <Link href={`/matches/${match.id}`} className="block transition active:scale-[.995]" style={{ position: "relative", overflow: "hidden", minHeight: 106, border: "1px solid #edf0f2", borderRadius: 18, color: "#111827", background: "#f8f9f9", boxShadow: "0 5px 16px rgba(15,23,42,.055)" }}>
      <img src="/demo/matches-court.webp" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", opacity: .07 }} />
      <span style={{ position: "absolute", top: 10, right: 12, zIndex: 2 }}><ForwardIndicator /></span>

      <div style={{ position: "relative", zIndex: 1, padding: "12px 14px 11px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 22px minmax(0, 1fr)", alignItems: "center", gap: 5, paddingRight: 22 }}>
          {[match.playerOne, match.playerTwo].map((player, index) => (
            <div key={player.id} style={{ display: "grid", gridColumn: index === 0 ? 1 : 3, gridTemplateColumns: "30px minmax(0, 1fr)", alignItems: "center", gap: 7, minWidth: 0 }}>
              <PlayerAvatar name={player.name} avatarUrl={player.avatarUrl} />
              <p className="line-clamp-2 break-words" style={{ fontSize: 11, fontWeight: 800, lineHeight: 1.12 }}>{player.name}</p>
            </div>
          ))}
          <span style={{ gridColumn: 2, gridRow: 1, color: "#9ca3af", fontSize: 8, fontWeight: 900, textAlign: "center" }}>VS</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginTop: 11, paddingTop: 9, borderTop: "1px solid rgba(15,23,42,.08)", color: "#6b7280", fontSize: 9, fontWeight: 650, textAlign: "center" }}>
          <span className="truncate px-1">{date}</span>
          <span className="truncate border-l border-black/5 px-1">{time}</span>
          <span className="truncate border-l border-black/5 px-1">{match.location || "Vieta nav norādīta"}</span>
          <span className="truncate border-l border-black/5 px-1">{match.court || "Korts nav norādīts"}</span>
        </div>
      </div>
    </Link>
  );
}

function formatScheduledDate(dateValue?: string) {
  if (!dateValue) {
    return "Laiks vēl nav norādīts";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Laiks vēl nav norādīts";
  }

  return new Intl.DateTimeFormat("lv-LV", {
    timeZone: "Europe/Riga",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function MatchRow({
  match,
  featured = false,
}: {
  match: TournamentMatch;
  featured?: boolean;
}) {
  return (
    <article
      className={clsx(
        "relative border-b border-black/5 py-4 last:border-b-0",
        featured && "py-5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={clsx(
              "truncate font-semibold text-black",
              featured ? "text-lg" : "text-sm"
            )}
          >
            {match.playerOne.name} – {match.playerTwo.name}
          </p>

          {match.status === "scheduled" && (
            <div className="mt-2 space-y-1 text-sm text-neutral-500">
              <p className="capitalize">
                {formatScheduledDate(match.scheduledAt)}
              </p>

              {match.court && <p>{match.court}</p>}

              {match.location && <p>{match.location}</p>}
            </div>
          )}

          {match.status === "completed" && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-black">
                {formatMatchScore(match)}
              </p>

              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-neutral-500">
                Pabeigta
              </span>
            </div>
          )}

          {match.status === "unscheduled" && (
            <div className="mt-2">
              <p className="text-sm text-neutral-500">
                Laiks vēl nav saskaņots
              </p>
            </div>
          )}

          {match.status === "cancelled" && (
            <p className="mt-2 text-sm text-red-600">
              Spēle atcelta
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {match.status === "scheduled" && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Ieplānota
            </span>
          )}
          <Link href={`/matches/${match.id}`} aria-label="Atvērt spēli">
            <ForwardIndicator />
          </Link>
        </div>
      </div>
    </article>
  );
}

function MatchSection({
  title,
  matches,
  variant = "default",
  emptyMessage,
  initialLimit,
}: MatchSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleMatches = initialLimit && !expanded ? matches.slice(0, initialLimit) : matches;

  return (
    <Card
      className={clsx(
        "w-full p-5 shadow-[0_5px_18px_rgba(15,23,42,0.045)]",
        variant === "featured" && "border-black/10"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">
          {title}
        </h2>

        <span className="text-xs font-medium text-neutral-400">
          {matches.length}
        </span>
      </div>

      {matches.length > 0 ? (
        <div className="mt-3">
          {visibleMatches.map((match, index) => (
            <MatchRow
              key={match.id}
              match={match}
              featured={variant === "featured" && index === 0}
            />
          ))}
          {initialLimit && matches.length > visibleMatches.length ? (
            <div className="flex justify-center pt-4">
              <button type="button" onClick={() => setExpanded(true)} className="text-[10px] font-extrabold text-neutral-500">Skatīt visas</button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-4 text-sm text-neutral-500">
          {emptyMessage}
        </p>
      )}
    </Card>
  );
}

export function MatchCalendar({
  matches,
}: MatchCalendarProps) {
  const [scheduledExpanded, setScheduledExpanded] = useState(false);
  const scheduledMatches = matches.filter(
    (match) => match.status === "scheduled"
  );

  const completedMatches = matches.filter(
    (match) => match.status === "completed"
  );

  const unscheduledMatches = matches.filter(
    (match) => match.status === "unscheduled"
  );
  const visibleScheduledMatches = scheduledExpanded
    ? scheduledMatches
    : scheduledMatches.slice(0, 3);

  return (
    <div className="space-y-4">
      {scheduledMatches.length ? (
        <Card className="w-full p-5 shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">Nākamās spēles</h2>
            <span className="text-xs font-medium text-neutral-400">{scheduledMatches.length}</span>
          </div>
          <div className="space-y-3">{visibleScheduledMatches.map((match) => <FeaturedMatch key={match.id} match={match} />)}</div>
          {!scheduledExpanded && scheduledMatches.length > visibleScheduledMatches.length ? (
            <div className="flex justify-center pt-4">
              <button type="button" onClick={() => setScheduledExpanded(true)} className="text-[10px] font-extrabold text-neutral-500">Skatīt visas</button>
            </div>
          ) : null}
        </Card>
      ) : (
        <MatchSection title="Nākamās spēles" matches={[]} emptyMessage="Pašlaik neviena nākamā spēle nav ieplānota." />
      )}

      <MatchSection
        title="Izspēlētās spēles"
        matches={completedMatches}
        emptyMessage="Vēl nav izspēlētu spēļu."
        initialLimit={5}
      />

      <MatchSection
        title="Neizspēlētās spēles"
        matches={unscheduledMatches}
        emptyMessage="Visas turnīra spēles jau ir ieplānotas vai izspēlētas."
        initialLimit={5}
      />
    </div>
  );
}
