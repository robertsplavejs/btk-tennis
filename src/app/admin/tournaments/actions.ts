"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createTournamentService } from "@/services/createTournamentService";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function createTournament(formData: FormData) {
  const seasonId = String(formData.get("seasonId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = "";
  try {
    await requireAdmin();
    const tournamentService =
      await createTournamentService();

    await tournamentService.createTournament({
      seasonId,
      name,
      slug,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās izveidot turnīru.";

    redirect(
      `/admin/tournaments/new?error=${encodeURIComponent(
        message
      )}`
    );
  }

  revalidatePath("/admin/tournaments");

  redirect("/admin/tournaments");
}

export async function deleteTournament(tournamentId: string) {
  const normalizedId = tournamentId.trim();

  try {
    await requireAdmin();
    const tournamentService = await createTournamentService();
    await tournamentService.deleteTournament(normalizedId);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās izdzēst turnīru.";

    redirect(
      `/admin/tournaments/${encodeURIComponent(normalizedId)}?error=${encodeURIComponent(message)}`
    );
  }

  revalidatePath("/");
  revalidatePath("/matches");
  revalidatePath("/tournament");
  revalidatePath("/profile");
  revalidatePath("/admin/tournaments");
  redirect("/admin/tournaments?success=Turn%C4%ABrs%20izdz%C4%93sts.");
}
