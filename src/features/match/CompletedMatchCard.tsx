/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export type MatchListPlayer = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type CompletedMatch = {
  id: string;
  player: MatchListPlayer;
  opponent: MatchListPlayer;
  playedAt: string;
  court: string;
  score: string[];
  setTypes?: Array<"regular" | "match_tiebreak">;
  result: "win" | "loss";
};

const shortDateFormatter = new Intl.DateTimeFormat("lv-LV", {
  day: "numeric",
  month: "long",
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

function PlayerAvatar({ player, size = 46 }: { player: MatchListPlayer; size?: number }) {
  if (player.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.name}
        style={{ display: "block", width: size, height: size, flexShrink: 0, border: "1px solid rgba(255,255,255,.2)", borderRadius: "50%", objectFit: "cover", background: "#f1f3f5", boxShadow: "0 1px 3px rgba(15,23,42,.1)" }}
      />
    );
  }

  return (
    <span
      aria-label={player.name}
      style={{ display: "grid", width: size, height: size, flexShrink: 0, placeItems: "center", border: "1px solid #e1e5e9", borderRadius: "50%", color: "#606875", background: "#f1f3f5", fontSize: Math.max(8, Math.round(size * .24)), fontWeight: 800, lineHeight: 1 }}
    >
      {initials(player.name)}
    </span>
  );
}

export function CompletedMatchCard({ match }: { match: CompletedMatch }) {
  const isWin = match.result === "win";
  const hasSuperTiebreak =
    match.setTypes?.[2] === "match_tiebreak";
  const sets = Array.from({ length: 3 }, (_, index) => {
    const set = match.score[index];
    if (!set) return null;

    const [playerScore = "–", opponentScore = "–"] = set.split(":");
    return {
      playerScore,
      opponentScore,
      playerWon: Number.parseInt(playerScore, 10) > Number.parseInt(opponentScore, 10),
    };
  });

  const playerName = (player: MatchListPlayer) => {
    const parts = player.name.trim().split(/\s+/);
    const firstName = parts.shift() ?? player.name;
    const lastName = parts.join(" ");
    const useTwoLines = player.name.length > 18 || lastName.includes("-");
    const lineStyle = { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const };

    return (
      <span title={player.name} style={{ display: "block", minWidth: 0, overflow: "hidden", fontSize: 14, fontWeight: 850, lineHeight: 1.08 }}>
        {useTwoLines ? <><span style={lineStyle}>{firstName}</span><span style={lineStyle}>{lastName || firstName}</span></> : <span style={lineStyle}>{player.name}</span>}
      </span>
    );
  };

  return (
    <Link
      href={`/matches/${match.id}`}
      aria-label={`Atvērt spēli: ${match.player.name} pret ${match.opponent.name}`}
      style={{ display: "grid", gridTemplateColumns: "22px minmax(0, 1fr) 22px", minHeight: 127, overflow: "hidden", border: "1px solid #e5e9ed", borderRadius: 17, color: "inherit", background: "#fff", boxShadow: "0 7px 21px rgba(15,23,42,.07)", textDecoration: "none" }}
    >
      <div style={{ position: "relative", color: "#fff", background: isWin ? "#9be000" : "#ff4b4b" }}>
        <span style={{ position: "absolute", top: "50%", left: "50%", fontSize: 7, fontWeight: 850, letterSpacing: ".04em", textTransform: "uppercase", whiteSpace: "nowrap", transform: "translate(-50%, -50%) rotate(-90deg)" }}>
          {isWin ? "Uzvara" : "Zaudējums"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 8, alignItems: "center", padding: "10px 9px 10px 11px" }}>
        <div style={{ display: "grid", gap: 8 }}>
          {[match.player, match.opponent].map((player) => (
            <div key={player.id} style={{ display: "grid", gridTemplateColumns: "46px minmax(0, 1fr)", gap: 9, alignItems: "center", minWidth: 0 }}>
              <PlayerAvatar player={player} />
              {playerName(player)}
            </div>
          ))}
        </div>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 23px)", gridTemplateRows: "46px 46px", alignItems: "center", paddingLeft: 7, borderLeft: "1px solid #edf0f2" }}>
          {hasSuperTiebreak ? (
            <span style={{ position: "absolute", top: 1, right: 0, zIndex: 1, width: 23, padding: "2px 0", borderRadius: 4, color: "#6f9800", background: "#f1f8df", fontSize: 6, fontWeight: 900, letterSpacing: ".03em", lineHeight: 1, textAlign: "center", textTransform: "uppercase", whiteSpace: "nowrap" }}>STB</span>
          ) : null}
          {sets.map((set, index) => <span key={`player-${index}`} style={{ display: "grid", height: "100%", placeItems: "center", color: set ? "#111827" : "#b0b5bc", fontSize: 14, fontWeight: set?.playerWon ? 900 : 750, fontVariantNumeric: "tabular-nums" }}>{set?.playerScore ?? "–"}</span>)}
          {sets.map((set, index) => <span key={`opponent-${index}`} style={{ display: "grid", height: "100%", placeItems: "center", borderTop: "1px solid #edf0f2", color: set ? "#111827" : "#b0b5bc", fontSize: 14, fontWeight: set && !set.playerWon ? 900 : 750, fontVariantNumeric: "tabular-nums" }}>{set?.opponentScore ?? "–"}</span>)}
        </div>
      </div>

      <div style={{ position: "relative", color: "#707984", background: "#f1f3f5", borderLeft: "1px solid #e1e5e8" }}>
        <time dateTime={match.playedAt} style={{ position: "absolute", top: "50%", left: "50%", fontSize: 7, fontWeight: 700, whiteSpace: "nowrap", transform: "translate(-50%, -50%) rotate(90deg)" }}>
          {shortDateFormatter.format(new Date(match.playedAt))}
        </time>
      </div>
    </Link>
  );
}
