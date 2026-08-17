import type { Json } from "@/types/database";

export type ActivityType =
  | "match_result"
  | "match_updated"
  | "match_scheduled"
  | "match_rescheduled"
  | "walkover"
  | "retired"
  | "player_joined"
  | "tournament_started"
  | "tournament_finished"
  | "match_card"
  | "system";

export type ActivityColor =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "gray";

export type ActivityIcon =
  | "🎾"
  | "🏆"
  | "📅"
  | "📸"
  | "🔥"
  | "👤"
  | "ℹ️";

export type ActivityMetadata = Json;

export type ActivityDraft = {
  activityType: ActivityType;
  title: string;
  description: string;
  icon: ActivityIcon;
  color: ActivityColor;
  metadata?: ActivityMetadata;
  tournamentId?: string | null;
  matchId?: string | null;
};

export type ActivityPlayer = {
  id: string;
  fullName: string;
};

export type MatchActivityContext = {
  matchId: string;
  tournamentId: string;

  actorUserId: string;
  actorName: string;

  playerOne: ActivityPlayer;
  playerTwo: ActivityPlayer;

  winnerId?: string | null;
  winnerName?: string | null;
  loserId?: string | null;
  loserName?: string | null;

  score?: string | null;

  scheduledAt?: string | null;
  location?: string | null;
  court?: string | null;
};

export type TournamentActivityContext = {
  tournamentId: string;
  tournamentName: string;
  actorUserId: string;
};

export type SystemActivityContext = {
  title: string;
  description: string;
  tournamentId?: string | null;
  matchId?: string | null;
  metadata?: ActivityMetadata;
};