"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

function invitationUrl(params: Record<string, string>) {
  return `/admin/invitations?${new URLSearchParams(params).toString()}`;
}

export async function createInvitation(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const accountType = String(formData.get("accountType") ?? "player");
  const playerId = String(formData.get("playerId") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const isAdmin = formData.get("isAdmin") === "on" || accountType === "admin";

  try {
    await requireAdmin();

    if (!email) {
      throw new Error("Ievadi e-pasta adresi.");
    }

    if (accountType === "player" && !playerId) {
      throw new Error("Izvēlies spēlētāja profilu.");
    }

    if (accountType === "admin" && displayName.length < 2) {
      throw new Error("Norādi administratora vārdu un uzvārdu.");
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_account_invitation", {
      invitation_email: email,
      invitation_player_id: accountType === "player" ? playerId : undefined,
      invitation_is_admin: isAdmin,
      invitation_display_name:
        accountType === "admin" ? displayName : undefined,
    });

    if (error) {
      throw new Error(error.message);
    }

    const invitation = data?.[0];

    if (!invitation) {
      throw new Error("Neizdevās izveidot uzaicinājumu.");
    }

    revalidatePath("/admin/invitations");
    redirect(
      invitationUrl({
        token: invitation.token,
        name: accountType === "admin" ? displayName : "spēlētājam",
      })
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    redirect(
      invitationUrl({
        error:
          error instanceof Error
            ? error.message
            : "Neizdevās izveidot uzaicinājumu.",
      })
    );
  }
}
