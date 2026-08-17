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
