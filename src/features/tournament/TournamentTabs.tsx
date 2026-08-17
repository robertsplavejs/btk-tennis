"use client";

import { useState, type ReactNode } from "react";

type TournamentTab = "standings" | "statistics" | "matches";
type Props = { standingsContent: ReactNode; statisticsContent: ReactNode; matchesContent: ReactNode };
const tabs: { id: TournamentTab; label: string }[] = [{ id: "standings", label: "Tabula" }, { id: "statistics", label: "Statistika" }, { id: "matches", label: "Spēles" }];

export function TournamentTabs({ standingsContent, statisticsContent, matchesContent }: Props) {
  const [activeTab, setActiveTab] = useState<TournamentTab>("standings");
  const content = { standings: standingsContent, statistics: statisticsContent, matches: matchesContent };
  return <div style={{ display: "grid", width: "100%", minWidth: 0, gap: 12 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", borderBottom: "1px solid #edf0f2" }}>
      {tabs.map((tab) => { const active = activeTab === tab.id; return <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ position: "relative", padding: "10px 5px 11px", border: 0, color: active ? "#61aa00" : "#7e848b", background: "transparent", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>{tab.label}{active && <span style={{ position: "absolute", right: 22, bottom: -1, left: 22, height: 2, borderRadius: 99, background: "#77bf17" }} />}</button>; })}
    </div>
    <div style={{ width: "100%", minWidth: 0 }}>{content[activeTab]}</div>
  </div>;
}
