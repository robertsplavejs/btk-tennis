"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createActivityEngine } from "@/core/activity/createActivityEngine";
import type { MatchActivityContext } from "@/core/activity/types";
import { createNotificationEngine } from "@/core/notifications/createNotificationEngine";
import type { MatchNotificationContext } from "@/core/notifications/types";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchHistoryService } from "@/services/createMatchHistoryService";
import { createMatchService } from "@/services/createMatchService";
import type { Json } from "@/types/database";

function walkoverUrl(
  matchId: string,
  params?: Record<string, string>
) {
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();

  return query
    ? `/matches/${matchId}/walkover?${query}`
    : `/matches/${matchId}/walkover`;
}

function revalidateMatchPages(
  matchId: string,
  tournamentId: string
) {
  revalidatePath(`/matches/${matchId}`);
  revalidatePath(`/matches/${matchId}/walkover`);
  revalidatePath("/matches");
  revalidatePath("/notifications");

  revalidatePath(
    `/admin/tournaments/${tournamentId}`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/matches`
  );

  revalidatePath(
    `/admin/tournaments/${tournamentId}/standings`
  );

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/tournament");
}

export async function saveWalkover(
  matchId: string,
  formData: FormData
) {
  const normalizedMatchId = matchId.trim();

  const winnerId = String(
    formData.get("winnerId") ?? ""
  ).trim();

  let tournamentId = "";

  try {
    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    if (!winnerId) {
      throw new Error(
        "Izvēlies spēlētāju, kuram piešķirt tehnisko uzvaru."
      );
    }

    const identity = await getCurrentIdentity();

    if (!identity) {
      throw new Error(
        "Lai piešķirtu tehnisko uzvaru, nepieciešams ielogoties."
      );
    }

    if (!identity.isAdmin) {
      throw new Error(
        "Tehnisko uzvaru drīkst piešķirt tikai administrators."
      );
    }

    const matchService = await createMatchService();

    const match =
      await matchService.getMatchById(normalizedMatchId);

    if (!match) {
      throw new Error("Spēle nav atrasta.");
    }

    if (!match.player_one || !match.player_two) {
      throw new Error(
        "Spēlei nav atrasti abi dalībnieki."
      );
    }

    const isMatchPlayer =
      winnerId === match.player_one_id ||
      winnerId === match.player_two_id;

    if (!isMatchPlayer) {
      throw new Error(
        "Tehnisko uzvaru var piešķirt tikai vienam no spēles dalībniekiem."
      );
    }

    tournamentId = match.tournament_id;

    const oldValue = {
      status: match.status,
      resultType: match.result_type,
      winnerId: match.winner_id,
      sets: match.sets.map((set) => ({
        setNumber: set.set_number,
        setType: set.set_type,
        playerOneScore: set.player_one_score,
        playerTwoScore: set.player_two_score,
        playerOneTiebreakPoints:
          set.player_one_tiebreak_points,
        playerTwoTiebreakPoints:
          set.player_two_tiebreak_points,
      })),
    } as Json;

    await matchService.saveWalkover({
      matchId: normalizedMatchId,
      enteredByUserId: identity.userId,
      winnerId,
    });

    const updatedMatch =
      await matchService.getMatchById(normalizedMatchId);

    if (!updatedMatch) {
      throw new Error(
        "Tehniskā uzvara saglabāta, bet spēli neizdevās atkārtoti ielādēt."
      );
    }

    const historyService =
      await createMatchHistoryService();

    await historyService.createEntry({
      matchId: normalizedMatchId,
      userId: identity.userId,
      action: "walkover",
      oldValue,
      newValue: {
        status: updatedMatch.status,
        resultType: updatedMatch.result_type,
        winnerId: updatedMatch.winner_id,
        sets: [],
      } as Json,
    });

    try {
      const winner =
        winnerId === match.player_one.id
          ? match.player_one
          : match.player_two;
      const loser =
        winnerId === match.player_one.id
          ? match.player_two
          : match.player_one;

      const context: MatchNotificationContext &
        MatchActivityContext = {
        matchId: updatedMatch.id,
        tournamentId: updatedMatch.tournament_id,
        actorUserId: identity.userId,
        actorName: identity.fullName,
        playerOne: {
          id: match.player_one.id,
          fullName: match.player_one.full_name,
        },
        playerTwo: {
          id: match.player_two.id,
          fullName: match.player_two.full_name,
        },
        winnerId: winner.id,
        winnerName: winner.full_name,
        loserId: loser.id,
        loserName: loser.full_name,
        score: null,
      };

      const [notificationEngine, activityEngine] =
        await Promise.all([
          createNotificationEngine(),
          createActivityEngine(),
        ]);

      const eventResults = await Promise.allSettled([
        notificationEngine.walkover(context),
        activityEngine.walkover(context),
      ]);

      for (const result of eventResults) {
        if (result.status === "rejected") {
          console.error(
            "Tehniskā uzvara saglabāta, bet saistīto notikumu neizdevās izveidot:",
            result.reason
          );
        }
      }
    } catch (eventError) {
      console.error(
        "Tehniskā uzvara saglabāta, bet saistītos notikumus neizdevās izveidot:",
        eventError
      );
    }

    revalidateMatchPages(
      normalizedMatchId,
      tournamentId
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Neizdevās piešķirt tehnisko uzvaru.";

    redirect(
      walkoverUrl(normalizedMatchId || matchId, {
        error: message,
      })
    );
  }

  redirect(`/matches/${normalizedMatchId}`);
}
