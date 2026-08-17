import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createTournamentViewService } from "@/services/createTournamentViewService";
import { TournamentScreen } from "@/features/tournament/TournamentScreen";

export default async function TournamentPage() {
  const identity = await getCurrentIdentity();

  const tournamentViewService =
    await createTournamentViewService();

  const tournamentHub =
    await tournamentViewService.getTournamentHubView(
      identity?.playerId ?? null
    );

  return (
    <TournamentScreen
      tournaments={tournamentHub.tournaments}
      currentPlayerId={identity?.playerId ?? null}
    />
  );
}
