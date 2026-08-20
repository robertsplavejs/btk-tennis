"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";
import { CompletedMatchCard, type CompletedMatch } from "./CompletedMatchCard";

export type { CompletedMatch } from "./CompletedMatchCard";

export type Player = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type ScheduledMatch = {
  id: string;
  opponent: Player;
  startsAt: string;
  court: string;
  opponentStats?: {
    ranking: number;
    record: string;
    points: number;
  };
};

export type MatchesFilter =
  | "all"
  | "unscheduled"
  | "scheduled"
  | "completed";

export type PendingMatch = {
  id: string;
  opponent: Player;
};

export type MatchesPageData = {
  tournamentName: string;
  groupName: string;
  totalMatches: number;
  playedMatches: number;
  currentPlayer: Player;
  nextMatch?: ScheduledMatch;
  scheduledMatches: ScheduledMatch[];
  pendingMatches: PendingMatch[];
  completedMatches: CompletedMatch[];
};

type MatchesScreenProps = {
  data: MatchesPageData;
  activeFilter?: MatchesFilter;
  scheduleHref?: (matchId: string) => string;
};

const matchDateFormatter = new Intl.DateTimeFormat("lv-LV", {
  day: "numeric",
  month: "long",
});

const matchTimeFormatter = new Intl.DateTimeFormat("lv-LV", {
  hour: "2-digit",
  minute: "2-digit",
});

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function OpponentName({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts.shift() ?? name;
  const lastName = parts.join(" ");
  const lineStyle = {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div
      title={name}
      style={{
        minWidth: 0,
        color: "#fff",
        fontSize: 23,
        fontWeight: 900,
        lineHeight: 1.02,
        letterSpacing: ".015em",
        textTransform: "uppercase",
      }}
    >
      <span style={lineStyle}>{firstName}</span>
      {lastName ? <span style={lineStyle}>{lastName}</span> : null}
      <span
        aria-hidden="true"
        style={{ display: "block", width: 74, height: 3, marginTop: 12, borderRadius: 99, background: "#b8ff00" }}
      />
    </div>
  );
}

function DetailIcon({ type }: { type: "date" | "time" | "court" }) {
  const paths = type === "date"
    ? <><rect x="3" y="4.5" width="14" height="12" rx="2"/><path d="M6 2.5v4M14 2.5v4M3 8h14"/></>
    : type === "time"
      ? <><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></>
      : <><path d="M10 18s5-5.2 5-10a5 5 0 1 0-10 0c0 4.8 5 10 5 10Z"/><circle cx="10" cy="8" r="1.5"/></>;
  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#b8ff00" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
}

function PlayerAvatar({ player, size = 52 }: { player: Player; size?: number }) {
  if (player.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.name}
        className="shrink-0 border border-white/20 object-cover shadow-sm"
        style={{ display: "block", width: size, height: size, flexShrink: 0, borderRadius: "50%", objectFit: "cover", background: "#f1f3f5" }}
      />
    );
  }

  return (
    <span
      className="grid shrink-0 place-items-center bg-slate-100 text-xs font-bold text-slate-600"
      style={{ display: "grid", width: size, height: size, flexShrink: 0, placeItems: "center", border: "1px solid #e1e5e9", borderRadius: "50%", color: "#606875", background: "#f1f3f5", fontSize: Math.max(8, Math.round(size * .24)), fontWeight: 800, lineHeight: 1 }}
      aria-label={player.name}
    >
      {initials(player.name)}
    </span>
  );
}

function Summary({ data }: { data: MatchesPageData }) {
  const remaining = Math.max(0, data.totalMatches - data.playedMatches);
  const stats = [
    ["Kopā", data.totalMatches],
    ["Izspēlētas", data.playedMatches],
    ["Atlikušas", remaining],
  ] as const;

  return (
    <header style={{ padding: "16px 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, padding: "9px 4px 10px", borderBottom: "1px solid #edf0f2", background: "#fff" }}>
        {stats.map(([label, value], index) => (
          <div key={label} style={{ minWidth: 0, borderLeft: index ? "1px solid #edf0f2" : 0, textAlign: "center" }}>
            <strong style={{ display: "block", color: "#111827", fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{value}</strong>
            <span style={{ display: "block", marginTop: 5, color: "#9ca3af", fontSize: 8, fontWeight: 850, letterSpacing: ".09em", textTransform: "uppercase" }}>{label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

function NextMatchCard({ data }: { data: MatchesPageData }) {
  const match = data.nextMatch;

  if (!match) {
    const hasUnscheduledMatches = data.pendingMatches.length > 0;
    const hasCompletedAllMatches =
      data.totalMatches > 0 &&
      data.playedMatches === data.totalMatches;

    if (hasCompletedAllMatches) {
      return null;
    }

    return (
      <section style={{ padding: "0 16px" }}>
        <div style={{ position: "relative", minHeight: 150, overflow: "hidden", padding: 18, borderRadius: 24, color: "#fff", background: "#06101a", boxShadow: "0 14px 32px rgba(15,23,42,.18)" }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.55)", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>
            Nākamā spēle
          </p>
          {hasUnscheduledMatches ? (
            <Link href="/matches?filter=unscheduled" aria-label="Ieplānot spēli" style={{ position: "absolute", top: 14, right: 16 }}><ForwardIndicator onDark /></Link>
          ) : null}
          <div style={{ display: "grid", minHeight: 100, placeItems: "center", textAlign: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 850 }}>
                Nav ieplānotas spēles
              </p>
              <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,.6)", fontSize: 10 }}>
                {hasUnscheduledMatches
                  ? "Izvēlies pretinieku no neizspēlētajām spēlēm."
                  : "Pašlaik nav pieejama nākamā spēle."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const opponentStats = match.opponentStats ?? {
    ranking: 0,
    record: "–",
    points: 0,
  };

  return (
    <section style={{ padding: "0 16px" }}>
      <div
        className="text-white"
        style={{ position: "relative", isolation: "isolate", minHeight: 270, overflow: "hidden", borderRadius: 24, background: "#020617", color: "#fff", boxShadow: "0 14px 32px rgba(15,23,42,.19)" }}
      >
        <img
          src="/demo/matches-court.webp"
          alt=""
          className="h-full w-full object-cover opacity-75"
          style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .78 }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(4,10,18,.42), rgba(4,10,18,.88)), linear-gradient(90deg, rgba(4,10,18,.58), rgba(4,10,18,.2))",
          }}
          aria-hidden="true"
        />
        <div style={{ position: "relative", zIndex: 2, minHeight: 270, padding: "18px 22px 62px" }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,.58)", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>Nākamā spēle</p>
          <Link
            href={`/matches/${match.id}`}
            aria-label="Atvērt spēli"
            style={{ position: "absolute", top: 14, right: 18, textDecoration: "none" }}
          >
            <ForwardIndicator onDark />
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "84px minmax(0, 1fr)", gap: 18, alignItems: "center", marginTop: 17, padding: "0 8px" }}>
            <PlayerAvatar player={match.opponent} size={80} />
            <OpponentName name={match.opponent.name} />
          </div>

          <div style={{ display: "grid", width: "88%", maxWidth: 292, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", margin: "14px auto 0" }}>
            {[
              ["Vieta", opponentStats.ranking ? `${opponentStats.ranking}.` : "–"],
              ["Punkti", String(opponentStats.points)],
              ["Bilance", opponentStats.record],
            ].map(([label, value], index) => (
              <div key={label} style={{ minWidth: 0, textAlign: "center", borderLeft: index ? "1px solid rgba(255,255,255,.15)" : 0 }}>
                <strong style={{ display: "block", overflow: "hidden", color: "#b8ff00", fontSize: 22, fontWeight: 900, lineHeight: 1, textOverflow: "ellipsis" }}>{value}</strong>
                <span style={{ display: "block", marginTop: 5, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", right: 18, bottom: 15, left: 18, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", paddingTop: 11, borderTop: "1px solid rgba(255,255,255,.2)" }}>
            <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: 0, color: "rgba(255,255,255,.82)", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}><DetailIcon type="date" />{matchDateFormatter.format(new Date(match.startsAt))}</p>
            <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: 0, borderLeft: "1px solid rgba(255,255,255,.13)", color: "rgba(255,255,255,.82)", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}><DetailIcon type="time" />{matchTimeFormatter.format(new Date(match.startsAt))}</p>
            <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: 0, borderLeft: "1px solid rgba(255,255,255,.13)", color: "rgba(255,255,255,.82)", fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}><DetailIcon type="court" />{match.court}</p>
          </div>
        </div>
        </div>
    </section>
  );
}

function MatchFilters({
  activeFilter,
  data,
  onChange,
}: {
  activeFilter: MatchesFilter;
  data: MatchesPageData;
  onChange: (filter: MatchesFilter) => void;
}) {
  const filters: Array<{
    id: MatchesFilter;
    label: string;
    count: number;
  }> = [
    { id: "all", label: "Visas", count: data.totalMatches },
    { id: "unscheduled", label: "Neizspēlētās", count: data.pendingMatches.length },
    { id: "scheduled", label: "Ieplānotas", count: data.scheduledMatches.length },
    { id: "completed", label: "Izspēlētās", count: data.completedMatches.length },
  ];

  return (
    <nav aria-label="Spēļu filtri" style={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginTop: 21, padding: "0 16px", borderBottom: "1px solid #edf0f2" }}>
      {filters.map((filter) => {
        const isActive = filter.id === activeFilter;

        return (
          <button key={filter.id} type="button" onClick={() => onChange(filter.id)} aria-current={isActive ? "page" : undefined} style={{ display: "flex", minWidth: 0, minHeight: 39, alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 2px 9px", border: 0, borderBottom: `2px solid ${isActive ? "#30363d" : "transparent"}`, color: isActive ? "#30363d" : "#9ca3af", background: "transparent", fontSize: 9, fontWeight: isActive ? 900 : 750, lineHeight: 1.1, textAlign: "center", cursor: "pointer" }}>
            <span>{filter.label}</span>
            <span style={{ fontSize: 8, fontWeight: 750, opacity: .72 }}>{filter.count}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PendingMatches({ matches, scheduleHref, showAll = false, onShowAll }: {
  matches: PendingMatch[];
  scheduleHref: (matchId: string) => string;
  showAll?: boolean;
  onShowAll?: () => void;
}) {
  const visibleMatches = showAll ? matches : matches.slice(0, 4);
  if (!visibleMatches.length) return null;

  return (
    <section style={{ marginTop: 18, padding: "0 16px" }}>
      <div style={{ display: "flex", minHeight: 21, alignItems: "flex-start", justifyContent: "space-between" }}><h2 style={{ margin: 0, color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>Neizspēlētās</h2>{!showAll && matches.length > visibleMatches.length ? <button type="button" onClick={onShowAll} style={{ padding: 0, border: 0, color: "#6b7280", background: "transparent", fontSize: 10, fontWeight: 800, cursor: "pointer" }}>Skatīt visas</button> : null}</div>
      <div
        className="bg-white"
        style={{ overflow: "hidden", padding: "3px 14px", border: "1px solid #edf0f2", borderRadius: 18, background: "#fff", boxShadow: "0 5px 18px rgba(15,23,42,.045)" }}
      >
        {visibleMatches.map((match, index) => (
          <div
            key={match.id}
            className="flex items-center gap-3 py-3.5"
            style={{ position: "relative", display: "flex", minHeight: 56, alignItems: "center", gap: 10, padding: "9px 0", borderTop: index ? "1px solid #f1f3f5" : 0 }}
          >
            <Link
              href={`/matches/${match.id}`}
              aria-label={`Atvērt spēli pret ${match.opponent.name}`}
              style={{ position: "absolute", inset: 0 }}
            />
            <PlayerAvatar player={match.opponent} size={34} />
            <p style={{ minWidth: 0, flex: 1, margin: 0, overflow: "hidden", fontSize: 14, fontWeight: 750, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {match.opponent.name}
            </p>
            <Link
              href={scheduleHref(match.id)}
              className="shrink-0"
              style={{ position: "relative", zIndex: 1, color: "#7b818b", fontSize: 10, fontWeight: 600, textDecoration: "none" }}
            >
              Ieplānot spēli
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScheduledMatches({ matches }: { matches: ScheduledMatch[] }) {
  if (!matches.length) return null;

  return (
    <section style={{ marginTop: 18, padding: "0 16px" }}>
      <h2 style={{ minHeight: 21, margin: 0, color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", lineHeight: 1, textTransform: "uppercase" }}>Ieplānotās spēles</h2>
      <div style={{ overflow: "hidden", padding: "3px 14px", border: "1px solid #edf0f2", borderRadius: 18, background: "#fff" }}>
        {matches.map((match, index) => (
          <Link key={match.id} href={`/matches/${match.id}`} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 62, padding: "9px 0", borderTop: index ? "1px solid #f1f3f5" : 0, color: "inherit", textDecoration: "none" }}>
            <PlayerAvatar player={match.opponent} size={34} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ margin: 0, overflow: "hidden", fontSize: 14, fontWeight: 750, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{match.opponent.name}</p>
              <p style={{ margin: "3px 0 0", color: "#7b818b", fontSize: 10 }}>{matchDateFormatter.format(new Date(match.startsAt))} · {matchTimeFormatter.format(new Date(match.startsAt))} · {match.court}</p>
            </div>
            <ForwardIndicator />
          </Link>
        ))}
      </div>
    </section>
  );
}

function CompletedMatches({ matches, showAll = false, onShowAll }: {
  matches: CompletedMatch[];
  showAll?: boolean;
  onShowAll?: () => void;
}) {
  const latestMatches = showAll ? matches : matches.slice(0, 4);
  if (!latestMatches.length) return null;

  return (
    <section style={{ marginTop: 18, padding: "0 16px" }}>
      <div style={{ display: "flex", minHeight: 21, alignItems: "flex-start", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>Izspēlētās</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 10 }}>
        {latestMatches.map((match) => <CompletedMatchCard key={match.id} match={match} />)}
      </div>
      {!showAll && matches.length > latestMatches.length ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 13 }}>
          <button type="button" onClick={onShowAll} style={{ padding: 0, border: 0, color: "#6b7280", background: "transparent", fontSize: 10, fontWeight: 800, cursor: "pointer" }}>Skatīt visas</button>
        </div>
      ) : null}
    </section>
  );
}

export function MatchesScreen({
  data,
  activeFilter = "all",
  scheduleHref = (matchId) => `/matches/${matchId}/schedule`,
}: MatchesScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState(activeFilter);
  const showAll = selectedFilter === "all";

  return (
    <main
      className="w-full bg-slate-50 text-slate-950"
      style={{ width: "100%", minHeight: "100%", paddingBottom: 28, overflowX: "hidden", color: "#0f172a", background: "#fff" }}
    >
      <Summary data={data} />
      <NextMatchCard data={data} />
      <MatchFilters activeFilter={selectedFilter} data={data} onChange={setSelectedFilter} />
      {(showAll || selectedFilter === "unscheduled") ? <PendingMatches matches={data.pendingMatches} scheduleHref={scheduleHref} showAll={!showAll} onShowAll={() => setSelectedFilter("unscheduled")} /> : null}
      {selectedFilter === "scheduled" ? <ScheduledMatches matches={data.scheduledMatches} /> : null}
      {(showAll || selectedFilter === "completed") ? <CompletedMatches matches={data.completedMatches} showAll={!showAll} onShowAll={() => setSelectedFilter("completed")} /> : null}
    </main>
  );
}
