import { redirect } from "next/navigation";

import { PlayerProfileScreen } from "@/features/profile/PlayerProfileScreen";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createPlayerProfileViewService } from "@/services/createPlayerProfileViewService";

type ProfilePageProps = {
  searchParams: Promise<{ matches?: string | string[] }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (!identity.playerId) {
    redirect(identity.isAdmin ? "/admin" : "/");
  }

  const playerProfileViewService =
    await createPlayerProfileViewService();

  const profile =
    await playerProfileViewService.getProfileView(identity.playerId);
  const { matches } = await searchParams;

  return (
    <PlayerProfileScreen
      profile={profile}
      canEditAvatar
      showAllMatches={matches === "all"}
    />
  );
}
