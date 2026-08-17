"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createParticipantService } from "@/services/createParticipantService";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function participantsUrl(
  tournamentId: string,
  params?: Record<string, string>
) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query
    ? `/admin/tournaments/${tournamentId}/participants?${query}`
    : `/admin/tournaments/${tournamentId}/participants`;
}

function revalidateTournamentPages(tournamentId: string) {
  revalidatePath(
    `/admin/tournaments/${tournamentId}`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/participants`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/matches`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/standings`
  );

  revalidatePath("/tournament");
  revalidatePath("/");
  revalidatePath("/profile");
}

export async function addParticipants(
  tournamentId: string,
  formData: FormData
) {
  const playerIds = formData
    .getAll("playerIds")
    .map((value) => String(value));

  let successMessage: string;

  try {
    await requireAdmin();
    const participantService =
      await createParticipantService();

    const result =
      await participantService.addParticipants(
        tournamentId,
        playerIds
      );

    successMessage =
      result.createdMatchesCount > 0
        ? `Pievienoti ${result.addedParticipantsCount} dalībnieki un automātiski izveidotas ${result.createdMatchesCount} jaunas spēles.`
        : `Turnīram pievienoti ${result.addedParticipantsCount} dalībnieki.`;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās pievienot dalībniekus.";

    redirect(
      participantsUrl(tournamentId, {
        error: message,
      })
    );
  }

  revalidateTournamentPages(tournamentId);

  redirect(
    participantsUrl(tournamentId, {
      success: successMessage,
    })
  );
}

export async function removeParticipant(
  tournamentId: string,
  playerId: string
) {
  try {
    await requireAdmin();
    const participantService =
      await createParticipantService();

    await participantService.removeParticipant(
      tournamentId,
      playerId
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās noņemt dalībnieku.";

    redirect(
      participantsUrl(tournamentId, {
        error: message,
      })
    );
  }

  revalidateTournamentPages(tournamentId);

  redirect(
    participantsUrl(tournamentId, {
      success: "Dalībnieks noņemts no turnīra.",
    })
  );
}
