import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export type CurrentIdentity = {
  authUser: Pick<User, "email" | "user_metadata">;
  userId: string;
  playerId: string | null;
  fullName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export const getCurrentIdentity = cache(async (): Promise<CurrentIdentity | null> => {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  const userId =
    typeof claims?.sub === "string" ? claims.sub : null;

  if (claimsError || !claims || !userId) {
    return null;
  }

  const { data: account, error: accountError } = await supabase
    .from("user_accounts")
    .select(`
      user_id,
      player_id,
      is_admin,
      player:players(
        full_name,
        avatar_url
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (accountError) {
    throw new Error(
      `Neizdevās ielādēt lietotāja kontu: ${accountError.message}`
    );
  }

  if (!account) {
    throw new Error(
      "Lietotāja kontam nav izveidots aplikācijas piekļuves ieraksts."
    );
  }

  const player = Array.isArray(account.player)
    ? account.player[0]
    : account.player;

  return {
    authUser: {
      email:
        typeof claims.email === "string"
          ? claims.email
          : undefined,
      user_metadata:
        claims.user_metadata &&
        typeof claims.user_metadata === "object"
          ? claims.user_metadata
          : {},
    },
    userId: account.user_id,
    playerId: account.player_id,
    fullName:
      player?.full_name ??
      String(claims.user_metadata?.full_name ?? "Administrators"),
    avatarUrl: player?.avatar_url ?? null,
    isAdmin: account.is_admin,
  };
});
