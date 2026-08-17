import type { MatchesPageData } from "./MatchesScreen";

const roberts = { id: "player-roberts", name: "Roberts Pļāvējs", avatarUrl: "/demo/roberts.jpg" };

export const matchesDemoData: MatchesPageData = {
  tournamentName: "BTK Vasaras līga 2026",
  groupName: "A grupa",
  totalMatches: 8,
  playedMatches: 4,
  currentPlayer: roberts,
  nextMatch: {
    id: "match-next",
    opponent: { id: "player-janis", name: "Jānis Bērziņš" },
    startsAt: "2026-08-12T18:00:00+03:00",
    court: "Korts Nr. 2",
    opponentStats: {
      ranking: 3,
      record: "5–2",
      points: 12,
    },
  },
  scheduledMatches: [
    {
      id: "match-next",
      opponent: { id: "player-janis", name: "Jānis Bērziņš" },
      startsAt: "2026-08-12T18:00:00+03:00",
      court: "Korts Nr. 2",
    },
  ],
  pendingMatches: [
    { id: "pending-1", opponent: { id: "player-kristaps", name: "Kristaps Ozols" } },
    { id: "pending-2", opponent: { id: "player-edgars", name: "Edgars Liepa" } },
    { id: "pending-3", opponent: { id: "player-martins", name: "Mārtiņš Kalniņš" } },
    { id: "pending-4", opponent: { id: "player-raineris", name: "Raineris Vilks" } },
  ],
  completedMatches: [
    {
      id: "completed-1",
      player: roberts,
      opponent: { id: "player-andris", name: "Andris Siliņš" },
      playedAt: "2026-08-08T19:30:00+03:00",
      court: "Korts Nr. 1",
      score: ["6:2", "6:4"],
      result: "win",
    },
    {
      id: "completed-2",
      player: roberts,
      opponent: { id: "player-krisjanis", name: "Krišjānis Zariņš" },
      playedAt: "2026-08-05T18:00:00+03:00",
      court: "Korts Nr. 3",
      score: ["6:1", "6:3"],
      result: "win",
    },
    {
      id: "completed-3",
      player: roberts,
      opponent: { id: "player-martins", name: "Mārtiņš Kalniņš" },
      playedAt: "2026-08-01T17:30:00+03:00",
      court: "Korts Nr. 2",
      score: ["4:6", "6:3", "8:10"],
      result: "loss",
    },
    {
      id: "completed-4",
      player: roberts,
      opponent: { id: "player-krisjanis-stokmanis", name: "Krišjānis Stokmanis-Blaus" },
      playedAt: "2026-07-27T20:00:00+03:00",
      court: "Korts Nr. 1",
      score: ["7:5", "6:4"],
      result: "win",
    },
    {
      id: "completed-5",
      player: roberts,
      opponent: { id: "player-gatis", name: "Gatis Vītols" },
      playedAt: "2026-07-20T18:30:00+03:00",
      court: "Korts Nr. 4",
      score: ["3:6", "6:4", "10:7"],
      result: "win",
    },
    {
      id: "completed-6",
      player: roberts,
      opponent: { id: "player-toms", name: "Toms Lapiņš" },
      playedAt: "2026-07-15T19:00:00+03:00",
      court: "Korts Nr. 2",
      score: ["6:4", "6:2"],
      result: "win",
    },
  ],
};
