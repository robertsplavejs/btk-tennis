import type { MatchCardThemeName } from "./MatchCardTheme";

export type MatchCardPlayer = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  initials?: string | null;
  winner: boolean;
};

export type MatchCardSet = {
  label: string;
  playerOneScore: string;
  playerTwoScore: string;
};

export type MatchCardData = {
  tournamentName: string;
  tournamentStage?: string;

  playerOne: MatchCardPlayer;
  playerTwo: MatchCardPlayer;

  sets: MatchCardSet[];

  matchScore: string;

  playedAt?: string | null;

  location?: string | null;
  court?: string | null;

  logoUrl?: string;

  theme?: MatchCardThemeName;
};