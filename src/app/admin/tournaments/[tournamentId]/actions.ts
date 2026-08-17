"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createMatchService } from "@/services/createMatchService";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function tournamentUrl(
  tournamentId: string,
  params?: Record<string, string>
) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query
    ? `/admin/tournaments/${tournamentId}?${query}`
    : `/admin/tournaments/${tournamentId}`;
}

export async function generateMatches(tournamentId: string) {
  let createdMatchesCount: number;

  try {
    await requireAdmin();
    const matchService = await createMatchService();

    const matches = await matchService.generateMatches(tournamentId);

    createdMatchesCount = matches.length;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās ģenerēt spēles.";

    redirect(
      tournamentUrl(tournamentId, {
        error: message,
      })
    );
  }

  revalidatePath(`/admin/tournaments/${tournamentId}`);

  redirect(
    tournamentUrl(tournamentId, {
      success: `Izveidotas ${createdMatchesCount} spēles.`,
    })
  );
}
