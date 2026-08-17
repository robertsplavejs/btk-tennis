"use server";

import { revalidatePath } from "next/cache";

import { createActivityEngine } from "@/core/activity/createActivityEngine";
import type { MatchActivityContext } from "@/core/activity/types";
import { createNotificationEngine } from "@/core/notifications/createNotificationEngine";
import type { MatchNotificationContext } from "@/core/notifications/types";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createClient } from "@/lib/supabase/server";
import { createMatchService } from "@/services/createMatchService";

export type SaveMatchScheduleInput = {
  scheduledAt: string;
  court: string;
  location?: string;
};

type SaveMatchScheduleResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

function revalidateMatchPages(
  matchId: string,
  tournamentId: string
) {
  revalidatePath(`/matches/${matchId}`);
  revalidatePath(`/matches/${matchId}/schedule`);
  revalidatePath("/matches");
  revalidatePath("/notifications");

  revalidatePath(
    `/admin/tournaments/${tournamentId}`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/matches`
  );

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/tournament");
}

export async function saveMatchSchedule(
  matchId: string,
  input: SaveMatchScheduleInput
): Promise<SaveMatchScheduleResponse> {
  try {
    const normalizedMatchId = matchId.trim();
    const court = input.court.trim();
    const location = input.location?.trim() || null;

    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    if (!court) {
      throw new Error("Norādi kortu.");
    }

    const scheduledAt = new Date(input.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error(
        "Norādītais datums vai laiks nav derīgs."
      );
    }

    if (scheduledAt.getTime() <= Date.now()) {
      throw new Error(
        "Spēles laikam jābūt nākotnē."
      );
    }

    const supabase = await createClient();

    const identity = await getCurrentIdentity();

    if (!identity) {
      throw new Error(
        "Lai ieplānotu spēli, nepieciešams ielogoties."
      );
    }

    const matchService = await createMatchService();

    const existingMatch =
      await matchService.getMatchById(normalizedMatchId);

    if (!existingMatch) {
      throw new Error("Spēle nav atrasta.");
    }

    if (
      !existingMatch.player_one ||
      !existingMatch.player_two
    ) {
      throw new Error(
        "Spēlei nav atrasti abi dalībnieki."
      );
    }

    if (existingMatch.status === "completed") {
      throw new Error(
        "Pabeigtai spēlei laiku vairs nevar mainīt."
      );
    }

    if (existingMatch.status === "cancelled") {
      throw new Error(
        "Atceltai spēlei laiku nevar mainīt."
      );
    }

    const isParticipant =
      identity.playerId === existingMatch.player_one_id ||
      identity.playerId === existingMatch.player_two_id;

    const isAdmin = identity.isAdmin;

    if (!isParticipant && !isAdmin) {
      throw new Error(
        "Spēles laiku drīkst mainīt tikai spēles dalībnieks vai administrators."
      );
    }

    if (
      existingMatch.status === "scheduled" &&
      existingMatch.scheduled_at === scheduledAt.toISOString() &&
      existingMatch.court === court &&
      existingMatch.location === location
    ) {
      return {
        success: true,
        message: "Spēles laiks nav mainīts.",
      };
    }

    const hadExistingSchedule =
      existingMatch.status === "scheduled" ||
      existingMatch.scheduled_at !== null;

    const { error: updateError } = await supabase
      .from("matches")
      .update({
        scheduled_at: scheduledAt.toISOString(),
        court,
        location,
        status: "scheduled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", normalizedMatchId);

    if (updateError) {
      throw new Error(
        `Neizdevās saglabāt spēles laiku: ${updateError.message}`
      );
    }

    const updatedMatch =
      await matchService.getMatchById(normalizedMatchId);

    if (!updatedMatch) {
      throw new Error(
        "Spēles laiks saglabāts, bet neizdevās ielādēt atjaunināto spēli."
      );
    }

    try {
      const context: MatchNotificationContext &
        MatchActivityContext = {
        matchId: updatedMatch.id,
        tournamentId: updatedMatch.tournament_id,
        actorUserId: identity.userId,
        actorName: identity.fullName,
        playerOne: {
          id: existingMatch.player_one.id,
          fullName:
            existingMatch.player_one.full_name,
        },
        playerTwo: {
          id: existingMatch.player_two.id,
          fullName:
            existingMatch.player_two.full_name,
        },
        scheduledAt: updatedMatch.scheduled_at,
        location: updatedMatch.location,
        court: updatedMatch.court,
      };

      const [notificationEngine, activityEngine] =
        await Promise.all([
          createNotificationEngine(),
          createActivityEngine(),
        ]);

      const events = hadExistingSchedule
        ? [
            notificationEngine.matchRescheduled(context),
            activityEngine.matchRescheduled(context),
          ]
        : [
            notificationEngine.matchScheduled(context),
            activityEngine.matchScheduled(context),
          ];

      const eventResults =
        await Promise.allSettled(events);

      for (const result of eventResults) {
        if (result.status === "rejected") {
          console.error(
            "Spēles laiks saglabāts, bet saistīto notikumu neizdevās izveidot:",
            result.reason
          );
        }
      }
    } catch (eventError) {
      console.error(
        "Spēles laiks saglabāts, bet saistītos notikumus neizdevās izveidot:",
        eventError
      );
    }

    revalidateMatchPages(
      normalizedMatchId,
      existingMatch.tournament_id
    );

    return {
      success: true,
      message: hadExistingSchedule
        ? "Spēles laiks veiksmīgi mainīts."
        : "Spēle veiksmīgi ieplānota.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Neizdevās saglabāt spēles laiku.",
    };
  }
}
