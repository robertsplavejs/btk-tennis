"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";

type TournamentTab = "standings" | "matches" | "statistics";

type TournamentTabsProps = {
  standingsContent: ReactNode;
  matchesContent: ReactNode;
  statisticsContent: ReactNode;
};

const tabs: { id: TournamentTab; label: string }[] = [
  { id: "standings", label: "Tabula" },
  { id: "matches", label: "Spēles" },
  { id: "statistics", label: "Statistika" },
];

export function TournamentTabs({
  standingsContent,
  matchesContent,
  statisticsContent,
}: TournamentTabsProps) {
  const [activeTab, setActiveTab] =
    useState<TournamentTab>("standings");

  const content = {
    standings: standingsContent,
    matches: matchesContent,
    statistics: statisticsContent,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 rounded-2xl bg-neutral-100 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-white font-semibold text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {content[activeTab]}
    </div>
  );
}