"use client";

/* eslint-disable @next/next/no-img-element */

import clsx from "clsx";
import { useMemo, useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { StandingRow } from "@/services/StandingEngine";

type StandingsTableProps = {
  standings: (StandingRow & { previousPosition?: number; avatarUrl?: string })[];
  currentPlayerId?: string | null;
  qualificationPlaces?: number;
};

type StatisticsSortKey =
  | "position"
  | "matchesPlayed"
  | "wins"
  | "losses"
  | "sets"
  | "games"
  | "difference"
  | "points";

function StatisticsSortButton({
  sortKey,
  activeKey,
  direction,
  onChange,
  children,
  align = "center",
}: {
  sortKey: StatisticsSortKey;
  activeKey: StatisticsSortKey;
  direction: "asc" | "desc";
  onChange: (key: StatisticsSortKey) => void;
  children: React.ReactNode;
  align?: "center" | "right";
}) {
  const isActive = activeKey === sortKey;

  return (
    <button
      type="button"
      onClick={() => onChange(sortKey)}
      aria-label={`Kārtot pēc ${String(children)}`}
      style={{
        border: 0,
        padding: 0,
        color: isActive ? "#61aa00" : "inherit",
        background: "transparent",
        font: "inherit",
        textAlign: align,
        cursor: "pointer",
      }}
    >
      {children}{isActive ? (direction === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function StandingsTable({
  standings,
  currentPlayerId = null,
  qualificationPlaces = 8,
}: StandingsTableProps) {
  return (
    <Card
      className="w-full max-h-[430px] min-w-0 overscroll-contain shadow-[0_5px_18px_rgba(15,23,42,0.045)]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        borderRadius: 28,
      }}
    >
      <div className="sticky top-0 z-10 border-b border-black/5 bg-white px-4 py-3">
        <div className="items-center gap-2 text-[10px] font-black uppercase tracking-wider text-neutral-400" style={{ display: "grid", gridTemplateColumns: "30px 38px minmax(0, 1fr) 48px" }}>
          <span>#</span><span /><span>Spēlētājs</span><span className="text-right">Punkti</span>
        </div>
      </div>

      {standings.map((player) => {
        const isCurrentPlayer = player.playerId === currentPlayerId;
        return (
          <div key={player.playerId}>
            <Link href={`/players/${player.playerId}`} aria-label={`Atvērt spēlētāja ${player.fullName} profilu`} className={clsx("items-center gap-2 border-b border-black/5 px-4 py-3 text-inherit no-underline", isCurrentPlayer && "bg-[#f5f8ee]") } style={{ display: "grid", gridTemplateColumns: "30px 38px minmax(0, 1fr) 48px", background: isCurrentPlayer ? "#f5f8ee" : undefined }}>
              <span className="text-sm font-black text-neutral-500">{player.position}</span>
              {player.avatarUrl ? <img src={player.avatarUrl} alt={player.fullName} style={{ display: "block", width: 36, height: 36, flexShrink: 0, border: "2px solid #fff", borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(15,23,42,.12)" }} /> : <span className={clsx("text-[10px] font-black", isCurrentPlayer ? "text-[#b8ff00]" : "text-neutral-600")} style={{ display: "grid", width: 36, height: 36, flexShrink: 0, placeItems: "center", color: isCurrentPlayer ? "#b8ff00" : "#626a73", background: isCurrentPlayer ? "#07111d" : "#f0f2f3", border: "2px solid #fff", borderRadius: "50%", boxShadow: "0 2px 8px rgba(15,23,42,.12)" }}>{initials(player.fullName)}</span>}
              <p className="truncate text-sm text-neutral-950" style={{ fontWeight: 750, letterSpacing: "-.01em" }}>{player.fullName}</p>
              <p className="text-right text-base font-black text-neutral-950">{player.points}</p>
            </Link>
            {player.position === qualificationPlaces && (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1" style={{ borderTop: "2px dashed #79b82a" }} />
                <span className="text-[11px] font-black uppercase" style={{ color: "#65a91b", letterSpacing: ".08em" }}>TOP {qualificationPlaces}</span>
                <div className="flex-1" style={{ borderTop: "2px dashed #79b82a" }} />
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

export function TournamentStatisticsTable({
  standings,
  currentPlayerId = null,
}: Omit<StandingsTableProps, "qualificationPlaces">) {
  const [sort, setSort] = useState<{
    key: StatisticsSortKey;
    direction: "asc" | "desc";
  }>({ key: "position", direction: "asc" });

  const sortedStandings = useMemo(() => {
    const getSortValue = (
      player: StandingsTableProps["standings"][number]
    ) => {
      switch (sort.key) {
        case "position": return player.position;
        case "matchesPlayed": return player.matchesPlayed;
        case "wins": return player.wins;
        case "losses": return player.losses;
        case "sets": return player.setDifference;
        case "games": return player.gameDifference;
        case "difference": return player.gameDifference;
        case "points": return player.points;
      }
    };

    return [...standings].sort((first, second) => {
      const difference = getSortValue(first) - getSortValue(second);

      if (difference !== 0) {
        return sort.direction === "asc" ? difference : -difference;
      }

      return first.position - second.position;
    });
  }, [sort, standings]);

  function changeSort(key: StatisticsSortKey) {
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === "desc" ? "asc" : "desc"
          : key === "position" ? "asc" : "desc",
    }));
  }

  return (
    <Card
      className="w-full max-h-[430px] min-w-0 overscroll-contain shadow-[0_5px_18px_rgba(15,23,42,0.045)]"
      style={{ overflow: "auto", borderRadius: 28 }}
    >
      <div style={{ minWidth: 690 }}>
        <div className="sticky top-0 z-10 border-b border-black/5 bg-white px-4 py-3">
          <div className="items-center gap-3 text-[10px] font-black uppercase tracking-wider text-neutral-400" style={{ display: "grid", gridTemplateColumns: "30px minmax(150px, 1fr) repeat(7, 52px)" }}>
            <StatisticsSortButton sortKey="position" activeKey={sort.key} direction={sort.direction} onChange={changeSort} align="right">#</StatisticsSortButton>
            <span>Spēlētājs</span>
            <StatisticsSortButton sortKey="matchesPlayed" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>Sp.</StatisticsSortButton>
            <StatisticsSortButton sortKey="wins" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>U</StatisticsSortButton>
            <StatisticsSortButton sortKey="losses" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>Z</StatisticsSortButton>
            <StatisticsSortButton sortKey="sets" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>Seti</StatisticsSortButton>
            <StatisticsSortButton sortKey="games" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>Geimi</StatisticsSortButton>
            <StatisticsSortButton sortKey="difference" activeKey={sort.key} direction={sort.direction} onChange={changeSort}>+/−</StatisticsSortButton>
            <StatisticsSortButton sortKey="points" activeKey={sort.key} direction={sort.direction} onChange={changeSort} align="right">Punkti</StatisticsSortButton>
          </div>
        </div>

        {sortedStandings.map((player) => {
          const isCurrentPlayer = player.playerId === currentPlayerId;

          return (
            <div
              key={player.playerId}
              className={clsx(
                "items-center gap-3 border-b border-black/5 px-4 py-3 text-xs text-neutral-700",
                isCurrentPlayer && "bg-[#f5f8ee]"
              )}
              style={{
                display: "grid",
                gridTemplateColumns: "30px minmax(150px, 1fr) repeat(7, 52px)",
                background: isCurrentPlayer ? "#f5f8ee" : undefined,
              }}
            >
              <span className="font-black text-neutral-500">{player.position}</span>
              <span className="truncate text-[13px] font-semibold text-neutral-950">{player.fullName}</span>
              <span className="text-center">{player.matchesPlayed}</span>
              <span className="text-center">{player.wins}</span>
              <span className="text-center">{player.losses}</span>
              <span className="text-center">{player.setsWon}:{player.setsLost}</span>
              <span className="text-center">{player.gamesWon}:{player.gamesLost}</span>
              <span className="text-center">{player.gameDifference > 0 ? "+" : ""}{player.gameDifference}</span>
              <span className="text-right text-sm font-black">{player.points}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
