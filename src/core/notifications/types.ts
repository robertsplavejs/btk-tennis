export type NotificationType =
  | "match_scheduled"
  | "match_rescheduled"
  | "result_created"
  | "result_updated"
  | "walkover"
  | "retired"
  | "tournament_created"
  | "tournament_started"
  | "system";

export type NotificationDraft = {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string | null;
  tournamentId?: string | null;
  matchId?: string | null;
};

export type NotificationPlayer = {
  id: string;
  fullName: string;
};

export type MatchNotificationContext = {
  matchId: string;
  tournamentId: string;
  actorUserId: string;
  actorName: string;
  playerOne: NotificationPlayer;
  playerTwo: NotificationPlayer;
  scheduledAt?: string | null;
  location?: string | null;
  court?: string | null;
  score?: string | null;
  winnerName?: string | null;
};

export type TournamentNotificationContext = {
  tournamentId: string;
  tournamentName: string;
  actorUserId: string;
  recipientUserIds: string[];
};