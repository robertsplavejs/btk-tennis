"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/Card";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";
import type { TournamentView } from "@/services/TournamentViewService";
import { MatchCalendar } from "./MatchCalendar";
import { StandingsTable, TournamentStatisticsTable } from "./StandingsTable";
import { TournamentHeader } from "./TournamentHeader";
import { TournamentTabs } from "./TournamentTabs";

type HubTab = "mine" | "others" | "upcoming" | "completed";
type TournamentScreenProps = { tournaments: TournamentView[]; currentPlayerId: string | null };

const hubTabs: { id: HubTab; label: string }[] = [
  { id: "mine", label: "Mans" }, { id: "others", label: "Citi" },
  { id: "upcoming", label: "Nākamie" }, { id: "completed", label: "Pabeigtie" },
];

function ProgressIcon({ type }: { type: "total" | "done" | "left" }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "total" ? <><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></> : type === "done" ? <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.7L16.5 9"/></> : <><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></>}
  </svg>;
}

function ProgressCard({ view }: { view: TournamentView }) {
  const { progress } = view;
  return (
    <Card className="w-full px-4 py-4 shadow-[0_5px_18px_rgba(15,23,42,0.045)]">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[["total", progress.totalMatches, "Kopējās spēles"], ["done", progress.completedMatches, "Nospēlētas"], ["left", Math.max(0, progress.totalMatches - progress.completedMatches), "Atlikušas"]].map(([icon, value, label], index) => <div key={String(label)} style={{ display: "grid", justifyItems: "center", gap: 5, padding: "0 6px", textAlign: "center", borderLeft: index ? "1px solid #eceff1" : 0 }}><span style={{ display: "grid", width: 30, height: 30, placeItems: "center", color: index === 1 ? "#66ad08" : "#59636f", background: index === 1 ? "#f1f9e5" : "#f5f7f8", borderRadius: "50%", transform: "scale(.84)" }}><ProgressIcon type={icon as "total" | "done" | "left"} /></span><strong style={{ display: "block", color: "#111", fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{value}</strong><small style={{ display: "block", color: "#7d838b", fontSize: 8, lineHeight: 1.2 }}>{label}</small></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginTop: 14 }}><div style={{ height: 6, overflow: "hidden", borderRadius: 99, background: "#e9ecef" }}><div style={{ width: `${progress.completionPercentage}%`, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#6abd00,#b4e600)" }} /></div><strong style={{ color: "#62ad00", fontSize: 13 }}>{progress.completionPercentage}%</strong></div>
    </Card>
  );
}

function TournamentDetail({ view, currentPlayerId, isMine }: { view: TournamentView; currentPlayerId: string | null; isMine: boolean }) {
  const highlightedPlayerId = isMine ? view.currentPlayer?.id ?? currentPlayerId : currentPlayerId;
  const groupName = view.tournament.groupName;
  return <div className="w-full min-w-0 space-y-4">
    <TournamentHeader tournament={view.tournament.name} group={groupName} position={isMine ? view.currentPlayer?.position : undefined} positionChange={isMine ? view.currentPlayer?.positionChange : undefined} participantCount={view.standings.length} />
    <TournamentTabs
      standingsContent={<StandingsTable standings={view.standings} currentPlayerId={highlightedPlayerId} qualificationPlaces={view.tournament.qualificationPlaces} />}
      statisticsContent={<TournamentStatisticsTable standings={view.standings} currentPlayerId={highlightedPlayerId} />}
      matchesContent={<MatchCalendar matches={view.matches} />}
    />
    <ProgressCard view={view} />
  </div>;
}

function TournamentList({ items, emptyText, onSelect }: { items: TournamentView[]; emptyText: string; onSelect?: (view: TournamentView) => void }) {
  if (!items.length) return <Card className="p-6 text-center text-sm leading-6 text-neutral-500">{emptyText}</Card>;
  return <div className="space-y-3">{items.map((view) => <button key={view.tournament.id} type="button" onClick={() => onSelect?.(view)} className="block w-full text-left">
    <Card className="overflow-hidden shadow-[0_5px_18px_rgba(15,23,42,0.045)] transition active:scale-[.99]"><div className="flex items-start justify-between gap-4 p-5"><div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[.14em] text-neutral-400">BTK turnīrs</p><h2 className="mt-3 line-clamp-2 text-xl font-black uppercase leading-[1.2] text-neutral-950">{view.tournament.name}</h2><p className="mt-2 text-xs text-neutral-400">{view.standings.length} dalībnieki · {view.progress.completedMatches}/{view.progress.totalMatches} spēles</p></div><ForwardIndicator /></div></Card>
  </button>)}</div>;
}

export function TournamentScreen({ tournaments, currentPlayerId }: TournamentScreenProps) {
  const isAuthenticated = Boolean(currentPlayerId);
  const [activeTab, setActiveTab] = useState<HubTab>(isAuthenticated ? "mine" : "others");
  const [selected, setSelected] = useState<TournamentView | null>(null);
  const availableTournaments = tournaments;
  const active = useMemo(() => availableTournaments.filter((view) => view.tournament.status === "active"), [availableTournaments]);
  const mine = availableTournaments.find((view) => Boolean(view.currentPlayer) && view.tournament.status !== "completed" && view.tournament.status !== "archived") ?? null;
  const others = active.filter((view) => view.tournament.id !== mine?.tournament.id);
  const upcoming = availableTournaments.filter((view) => (view.tournament.status === "draft" || view.tournament.status === "upcoming") && view.tournament.id !== mine?.tournament.id);
  const completed = availableTournaments.filter((view) => view.tournament.status === "completed");

  function changeTab(tab: HubTab) { setActiveTab(tab); setSelected(null); }
  const visibleHubTabs = isAuthenticated ? hubTabs : hubTabs.filter((tab) => tab.id !== "mine");
  return <div className="space-y-4 px-4 pb-7 pt-4">
    {!isAuthenticated ? <div><p className="text-[10px] font-black uppercase tracking-[.14em] text-neutral-400">BTK turnīri</p><h1 className="mt-1 text-2xl font-black text-neutral-950">Turnīru apskate</h1></div> : null}
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${visibleHubTabs.length}, minmax(0, 1fr))`, borderBottom: "1px solid #edf0f2" }}>{visibleHubTabs.map((tab) => { const active = activeTab === tab.id; return <button key={tab.id} type="button" onClick={() => changeTab(tab.id)} style={{ position: "relative", minWidth: 0, padding: "9px 1px 10px", border: 0, color: active ? "#61aa00" : "#92979d", background: "transparent", fontSize: 9, fontWeight: 900, textTransform: "uppercase" }}>{tab.label}{active && <span style={{ position: "absolute", right: 12, bottom: -1, left: 12, height: 2, borderRadius: 99, background: "#77bf17" }} />}</button>; })}</div>

    {activeTab === "mine" && (mine ? <TournamentDetail view={mine} currentPlayerId={currentPlayerId} isMine /> : <Card className="p-6 text-center text-sm text-neutral-500">Tev pašlaik nav aktīva turnīra.</Card>)}
    {activeTab === "others" && (selected ? <><button type="button" onClick={() => setSelected(null)} className="text-xs font-black uppercase tracking-wider text-neutral-500">← Visi citi turnīri</button><TournamentDetail view={selected} currentPlayerId={currentPlayerId} isMine={false} /></> : <TournamentList items={others} emptyText="Pašlaik nav citu aktīvu turnīru." onSelect={setSelected} />)}
    {activeTab === "upcoming" && (selected ? <><button type="button" onClick={() => setSelected(null)} className="text-xs font-black uppercase tracking-wider text-neutral-500">← Visi nākamie turnīri</button><TournamentDetail view={selected} currentPlayerId={currentPlayerId} isMine={Boolean(selected.currentPlayer)} /></> : <TournamentList items={upcoming} emptyText="Nav izziņotu nākamo turnīru." onSelect={setSelected} />)}
    {activeTab === "completed" && (selected ? <><button type="button" onClick={() => setSelected(null)} className="text-xs font-black uppercase tracking-wider text-neutral-500">← Turnīru vēsture</button><TournamentDetail view={selected} currentPlayerId={currentPlayerId} isMine={Boolean(selected.currentPlayer)} /></> : <TournamentList items={completed} emptyText="Pabeigto turnīru vēsture ir tukša." onSelect={setSelected} />)}
  </div>;
}
