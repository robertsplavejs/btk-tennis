export type MatchStatus =
  | "scheduled"
  | "completed"
  | "unscheduled"
  | "cancelled";

export type MatchFormResult = "win" | "loss";

export type MatchSet = {
  playerOneGames: number;
  playerTwoGames: number;
  tiebreak?: {
    playerOnePoints: number;
    playerTwoPoints: number;
  };
};

export type MatchPlayer = {
  id: string;
  name: string;
  avatarUrl?: string;
  ranking?: number;
  points?: number;
  recentForm?: MatchFormResult[];
};

export type TournamentMatch = {
  id: string;

  tournamentId: string;
  groupId: string;

  playerOne: MatchPlayer;
  playerTwo: MatchPlayer;

  status: MatchStatus;

  scheduledAt?: string;

  court?: string;

  location?: string;

  sets?: MatchSet[];

  winnerId?: string;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
};