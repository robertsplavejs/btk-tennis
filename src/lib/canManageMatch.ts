import type { TournamentMatch } from "@/types/match";

type CanManageMatchOptions = {
  match: TournamentMatch;
  userId: string;
  isAdmin?: boolean;
};

export function canManageMatch({
  match,
  userId,
  isAdmin = false,
}: CanManageMatchOptions): boolean {
  if (isAdmin) {
    return true;
  }

  return (
    match.playerOne.id === userId ||
    match.playerTwo.id === userId
  );
}