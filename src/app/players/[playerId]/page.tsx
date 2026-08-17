import { notFound, redirect } from "next/navigation";

import { PlayerProfileScreen } from "@/features/profile/PlayerProfileScreen";
import { createClient } from "@/lib/supabase/server";
import { createPlayerProfileViewService } from "@/services/createPlayerProfileViewService";
import { PlayerNotFoundError } from "@/services/PlayerProfileViewService";

type PlayerPageProps = {
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{ matches?: string | string[] }>;
};

export default async function PlayerPage({ params, searchParams }: PlayerPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { playerId } = await params;
  const { matches } = await searchParams;
  let profile;

  try {
    const service = await createPlayerProfileViewService();
    profile = await service.getProfileView(playerId);
  } catch (error) {
    if (error instanceof PlayerNotFoundError) {
      notFound();
    }

    throw error;
  }

  return <PlayerProfileScreen profile={profile} showAllMatches={matches === "all"} />;
}
