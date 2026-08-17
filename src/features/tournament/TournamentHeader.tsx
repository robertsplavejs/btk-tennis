/* eslint-disable @next/next/no-img-element */

import { Card } from "@/components/ui/Card";

type TournamentHeaderProps = {
  tournament: string;
  group?: string;
  position?: number;
  positionChange?: number;
  participantCount?: number;
};

export function TournamentHeader({ tournament, group, position, positionChange, participantCount }: TournamentHeaderProps) {
  const change = positionChange ?? 0;
  return (
    <Card className="overflow-hidden border-0" style={{ boxShadow: "0 14px 34px rgba(15,23,42,.14)" }}>
      <div style={{ position: "relative", minHeight: 196, overflow: "hidden", color: "#fff", background: "#07111d" }}>
        <img src="/demo/matches-court.png" alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .55 }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,12,20,.94), rgba(4,12,20,.48)), linear-gradient(0deg, rgba(4,12,20,.72), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "17px 20px 19px" }}>
          {group && <span style={{ display: "inline-flex", padding: "6px 10px", border: "1px solid rgba(255,255,255,.16)", borderRadius: 8, color: "rgba(255,255,255,.72)", background: "rgba(255,255,255,.08)", fontSize: 9, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase" }}>{group}</span>}
          <h1 style={{ maxWidth: 250, margin: "14px 0 0", color: "#fff", fontSize: 25, fontWeight: 950, lineHeight: 1.02, letterSpacing: ".01em", textTransform: "uppercase" }}>{tournament}</h1>
          <div style={{ display: "grid", gap: 7, marginTop: 15, color: "rgba(255,255,255,.9)", fontSize: 10, fontWeight: 750 }}>
            <p style={{ display: "flex", alignItems: "center", gap: 9, margin: 0 }}><span style={{ color: "#b8ff00", fontSize: 16 }}>◉</span>{participantCount ?? 0} dalībnieki</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", padding: "14px 12px", background: "#fff", textAlign: "center" }}>
        {typeof position === "number" ? <>
          <div style={{ padding: "0 12px" }}><p style={{ margin: 0, color: "#7c828a", fontSize: 9, fontWeight: 850, letterSpacing: ".08em", textTransform: "uppercase" }}>Pozīcija</p><p style={{ margin: "5px 0 0", color: "#111", fontSize: 18, fontWeight: 900 }}>{position}. vieta</p></div>
          <div style={{ padding: "0 12px", borderLeft: "1px solid #eceff1" }}><p style={{ margin: 0, color: "#7c828a", fontSize: 9, fontWeight: 850, letterSpacing: ".08em", textTransform: "uppercase" }}>Izmaiņas 7 dienās</p><p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 22, margin: "5px 0 0", color: change < 0 ? "#dc2626" : change > 0 ? "#65b900" : "#7c828a", fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{change !== 0 ? <span aria-hidden="true" style={{ fontSize: 11, lineHeight: 1 }}>{change > 0 ? "↑" : "↓"}</span> : null}<span>{Math.abs(change)}</span></p></div>
        </> : <div style={{ gridColumn: "1 / -1", padding: "0 22px" }}><p style={{ margin: 0, color: "#7c828a", fontSize: 10, fontWeight: 850, textTransform: "uppercase" }}>Dalībnieki</p><p style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 900 }}>{participantCount ?? 0}</p></div>}
      </div>
    </Card>
  );
}
