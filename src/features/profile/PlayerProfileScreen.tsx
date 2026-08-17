/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { PlayerProfileView } from "@/services/PlayerProfileViewService";
import { AvatarUploadForm } from "@/features/profile/AvatarUploadForm";
import { CompletedMatchCard } from "@/features/match/CompletedMatchCard";

type PlayerProfileScreenProps = {
  profile: PlayerProfileView;
  canEditAvatar?: boolean;
  showAllMatches?: boolean;
};

function percentage(won: number, lost: number) {
  const total = won + lost;
  return total ? Math.round((won / total) * 100) : 0;
}

function ComparisonRow({ label, won, lost }: { label: string; won: number; lost: number }) {
  const total = won + lost;
  const wonWidth = total ? Math.max(5, (won / total) * 100) : 50;
  const lostWidth = total ? Math.max(5, (lost / total) * 100) : 50;
  const comparisonColor =
    won > lost
      ? "linear-gradient(90deg,#77bd15,#a7e800)"
      : won < lost
        ? "linear-gradient(90deg,#ef4444,#f87171)"
        : "#9ca3af";

  return (
    <div style={{ padding: "11px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "42px minmax(0, 1fr) 42px", alignItems: "end", gap: 8 }}>
        <strong style={{ color: "#111827", fontSize: 20, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{won}</strong>
        <p style={{ margin: 0, color: "#4b5563", fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textAlign: "center" }}>
          {label} <span style={{ color: "#a0a6ad", fontSize: 8, fontWeight: 750, letterSpacing: 0 }}>· {percentage(won, lost)}%</span>
        </p>
        <strong style={{ color: "#69717c", fontSize: 20, fontWeight: 850, lineHeight: 1, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{lost}</strong>
      </div>
      <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: `${wonWidth}fr ${lostWidth}fr`, gap: 4, height: 5, marginTop: 8 }}>
        <span style={{ borderRadius: 99, background: comparisonColor }} />
        <span style={{ borderRadius: 99, background: "#e4e7ea" }} />
      </div>
    </div>
  );
}

export function PlayerProfileScreen({
  profile,
  canEditAvatar = false,
  showAllMatches = false,
}: PlayerProfileScreenProps) {
  const setDifference =
    profile.statistics.setsWon - profile.statistics.setsLost;
  const gameDifference =
    profile.statistics.gamesWon - profile.statistics.gamesLost;
  const completedMatches = profile.recentMatches.map((match) => {
    const isPlayerOne = match.playerOne.id === profile.player.id;
    const player = isPlayerOne ? match.playerOne : match.playerTwo;
    const opponent = isPlayerOne ? match.playerTwo : match.playerOne;

    return {
      id: match.id,
      player,
      opponent,
      playedAt:
        match.updatedAt ??
        match.scheduledAt ??
        match.createdAt ??
        new Date(0).toISOString(),
      court: match.court ?? "—",
      score: (match.sets ?? []).map((set) =>
        isPlayerOne
          ? `${set.playerOneGames}:${set.playerTwoGames}`
          : `${set.playerTwoGames}:${set.playerOneGames}`
      ),
      setTypes: (match.sets ?? []).map(
        (set) => set.setType ?? "regular"
      ),
      result:
        match.winnerId === profile.player.id
          ? ("win" as const)
          : ("loss" as const),
    };
  });
  const visibleCompletedMatches = showAllMatches
    ? completedMatches
    : completedMatches.slice(0, 5);
  const matchesHref = canEditAvatar
    ? "/profile?matches=all"
    : `/players/${profile.player.id}?matches=all`;

  return (
    <main style={{ width: "100%", minHeight: "100%", padding: "16px 16px 28px", overflowX: "hidden", color: "#0f172a", background: "#fff" }}>
      <section style={{ overflow: "hidden", border: "1px solid #e7eaed", borderRadius: 28, background: "#fff", boxShadow: "0 10px 28px rgba(15,23,42,.09)" }}>
        <div style={{ position: "relative", display: "grid", justifyItems: "center", overflow: "hidden", padding: "24px 18px 22px", background: "#050b10" }}>
          <img src="/demo/home-hero-dark.png" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: .9 }} />
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(3,8,12,.7) 0%, rgba(3,8,12,.3) 50%, rgba(3,8,12,.16) 100%)" }} />
          {profile.player.avatarUrl ? (
            <img src={profile.player.avatarUrl} alt={profile.player.fullName} style={{ position: "relative", zIndex: 2, display: "block", width: 98, height: 98, border: "3px solid rgba(190,242,100,.88)", borderRadius: "50%", objectFit: "cover", boxShadow: "0 7px 22px rgba(0,0,0,.28)" }} />
          ) : (
            <span style={{ position: "relative", zIndex: 2, display: "grid", width: 98, height: 98, placeItems: "center", border: "3px solid rgba(190,242,100,.88)", borderRadius: "50%", color: "#d7dde2", background: "rgba(5,13,20,.78)", fontSize: 25, fontWeight: 900 }}>{profile.player.initials}</span>
          )}
          {canEditAvatar ? <AvatarUploadForm /> : null}
        </div>
        <div style={{ display: "grid", justifyItems: "center", padding: "13px 18px 14px", background: "#fff" }}>
          <h1 style={{ margin: 0, color: "#111827", fontSize: 21, fontWeight: 950, lineHeight: 1.1, letterSpacing: ".025em", textAlign: "center", textTransform: "uppercase" }}>{profile.player.fullName}</h1>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px", color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>Aktīvā turnīra statistika</h2>
        <div style={{ overflow: "hidden", padding: "18px 18px 10px", border: "1px solid #edf0f2", borderRadius: 22, background: "#fff", boxShadow: "0 5px 18px rgba(15,23,42,.045)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", padding: "4px 0 18px", borderBottom: "1px solid #edf0f2" }}>
            {[
              { label: "Vieta", value: profile.tournament?.position ? `${profile.tournament.position}.` : "—", positionChange: profile.tournament?.positionChange ?? 0 },
              { label: "Punkti", value: profile.tournament?.points ?? 0 },
            ].map(({ label, value, positionChange }, index) => (
              <div key={label} style={{ minWidth: 0, textAlign: "center", borderLeft: index ? "1px solid #edf0f2" : 0 }}>
                <strong style={{ display: "block", color: "#111827", fontSize: 32, fontWeight: 950, lineHeight: 1 }}>{value}</strong>
                <span style={{ display: "block", marginTop: 8, color: "#8a9098", fontSize: 9, fontWeight: 850, letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</span>
                {label === "Vieta" ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, minHeight: 14, marginTop: 6, color: positionChange && positionChange < 0 ? "#dc2626" : positionChange && positionChange > 0 ? "#65b900" : "#9ca3af", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>
                    <span style={{ color: "#9ca3af", fontSize: 8, fontWeight: 800, letterSpacing: ".06em" }}>7 DIENĀS</span>
                    {positionChange ? <span aria-hidden="true" style={{ fontSize: 8 }}>{positionChange > 0 ? "↑" : "↓"}</span> : null}
                    <span>{Math.abs(positionChange ?? 0)}</span>
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <ComparisonRow label="UZVARAS" won={profile.statistics.wins} lost={profile.statistics.losses} />
          <ComparisonRow label="SETI" won={profile.statistics.setsWon} lost={profile.statistics.setsLost} />
          <ComparisonRow label="GEIMI" won={profile.statistics.gamesWon} lost={profile.statistics.gamesLost} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", margin: "4px -18px -10px", padding: "15px 12px", borderTop: "1px solid #edf0f2", background: "#f8f9fa" }}>
            {[
              ["Setu starpība", setDifference],
              ["Geimu starpība", gameDifference],
            ].map(([label, value], index) => (
              <div key={label} style={{ textAlign: "center", borderLeft: index ? "1px solid #e1e5e9" : 0 }}>
                <strong style={{ color: Number(value) > 0 ? "#65a30d" : Number(value) < 0 ? "#dc2626" : "#111827", fontSize: 18, fontWeight: 900 }}>
                  {Number(value) > 0 ? "+" : ""}{value}
                </strong>
                <span style={{ display: "block", marginTop: 4, color: "#8a9098", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {completedMatches.length ? (
        <section style={{ marginTop: 23 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
            <h2 style={{ margin: 0, color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase" }}>{showAllMatches ? "Izspēlētās spēles" : "Pēdējās spēles"}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 10 }}>
            {visibleCompletedMatches.map((match) => (
              <CompletedMatchCard key={match.id} match={match} />
            ))}
          </div>
          {!showAllMatches && completedMatches.length > 5 ? (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 13 }}>
              <Link href={matchesHref} style={{ color: "#6b7280", fontSize: 10, fontWeight: 800, textDecoration: "none" }}>Skatīt visas</Link>
            </div>
          ) : null}
        </section>
      ) : null}

      {canEditAvatar ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 22 }}>
          <Link href="/account/password" style={{ color: "#6b7280", fontSize: 11, fontWeight: 800, textDecoration: "none" }}>
            Mainīt paroli
          </Link>
        </div>
      ) : null}
    </main>
  );
}
