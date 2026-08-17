"use server";

import { revalidatePath } from "next/cache";

import { createActivityEngine } from "@/core/activity/createActivityEngine";
import type { MatchActivityContext } from "@/core/activity/types";
import { createNotificationEngine } from "@/core/notifications/createNotificationEngine";
import type { MatchNotificationContext } from "@/core/notifications/types";
import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";
import { createMatchHistoryService } from "@/services/createMatchHistoryService";
import { createMatchService } from "@/services/createMatchService";
import type { Json } from "@/types/database";

export type SaveMatchSetInput = {
  playerOneScore: number;
  playerTwoScore: number;
  setType?: string;
  playerOneTiebreakPoints?: number | null;
  playerTwoTiebreakPoints?: number | null;
};

type SaveMatchResultResponse =
  | {
      success: true;
      changed: boolean;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

type MatchHistorySnapshot = {
  status: string;
  winnerId: string | null;
  resultEnteredBy: string | null;
  sets: Array<{
    setNumber: number;
    setType: string;
    playerOneScore: number;
    playerTwoScore: number;
    playerOneTiebreakPoints: number | null;
    playerTwoTiebreakPoints: number | null;
  }>;
};

type MatchForSnapshot = {
  status: string;
  winner_id: string | null;
  result_entered_by: string | null;
  sets: Array<{
    set_number: number;
    set_type: string;
    player_one_score: number;
    player_two_score: number;
    player_one_tiebreak_points: number | null;
    player_two_tiebreak_points: number | null;
  }>;
};

type UpdatedMatchForEvents = MatchForSnapshot & {
  id: string;
  tournament_id: string;
  winner_id: string | null;
  player_one: {
    id: string;
    full_name: string;
  } | null;
  player_two: {
    id: string;
    full_name: string;
  } | null;
  winner: {
    id: string;
    full_name: string;
  } | null;
};

function createResultSnapshot(
  match: MatchForSnapshot
): MatchHistorySnapshot {
  return {
    status: match.status,
    winnerId: match.winner_id,
    resultEnteredBy: match.result_entered_by,
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
  };
}

function formatResultScore(
  sets: MatchForSnapshot["sets"]
) {
  const score = sets
    .map(
      (set) =>
        `${set.player_one_score}:${set.player_two_score}`
    )
    .join(" · ");

  return score || null;
}

function isSameResult(
  existingSets: MatchForSnapshot["sets"],
  submittedSets: SaveMatchSetInput[]
) {
  if (existingSets.length !== submittedSets.length) {
    return false;
  }

  return existingSets.every((existingSet, index) => {
    const submittedSet = submittedSets[index];

    return (
      existingSet.set_number === index + 1 &&
      existingSet.set_type ===
        (submittedSet.setType === "match-tiebreak"
          ? "match_tiebreak"
          : "regular") &&
      existingSet.player_one_score ===
        submittedSet.playerOneScore &&
      existingSet.player_two_score ===
        submittedSet.playerTwoScore &&
      existingSet.player_one_tiebreak_points ===
        (submittedSet.playerOneTiebreakPoints ?? null) &&
      existingSet.player_two_tiebreak_points ===
        (submittedSet.playerTwoTiebreakPoints ?? null)
    );
  });
}

function revalidateMatchPages(
  matchId: string,
  tournamentId: string
) {
  revalidatePath(`/matches/${matchId}`);
  revalidatePath(`/matches/${matchId}/result`);
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

function createEventContexts(input: {
  actorUserId: string;
  actorName: string;
  match: UpdatedMatchForEvents;
}) {
  const { match } = input;

  if (
    !match.player_one ||
    !match.player_two ||
    !match.winner_id
  ) {
    return null;
  }

  const winner =
    match.winner_id === match.player_one.id
      ? match.player_one
      : match.player_two;

  const loser =
    match.winner_id === match.player_one.id
      ? match.player_two
      : match.player_one;

  const score = formatResultScore(match.sets);

  const notificationContext: MatchNotificationContext = {
    matchId: match.id,
    tournamentId: match.tournament_id,
    actorUserId: input.actorUserId,
    actorName: input.actorName,
    playerOne: {
      id: match.player_one.id,
      fullName: match.player_one.full_name,
    },
    playerTwo: {
      id: match.player_two.id,
      fullName: match.player_two.full_name,
    },
    score,
    winnerName: winner.full_name,
  };

  const activityContext: MatchActivityContext = {
    matchId: match.id,
    tournamentId: match.tournament_id,
    actorUserId: input.actorUserId,
    actorName: input.actorName,
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
    score,
  };

  return {
    notificationContext,
    activityContext,
  };
}

async function createResultEvents(input: {
  hadExistingResult: boolean;
  actorUserId: string;
  actorName: string;
  match: UpdatedMatchForEvents;
}) {
  const contexts = createEventContexts(input);

  if (!contexts) {
    return;
  }

  const [notificationEngine, activityEngine] =
    await Promise.all([
      createNotificationEngine(),
      createActivityEngine(),
    ]);

  const notificationPromise = input.hadExistingResult
    ? notificationEngine.resultUpdated(
        contexts.notificationContext
      )
    : notificationEngine.resultCreated(
        contexts.notificationContext
      );

  const activityPromise = input.hadExistingResult
    ? activityEngine.matchUpdated(
        contexts.activityContext
      )
    : activityEngine.matchResult(
        contexts.activityContext
      );

  const results = await Promise.allSettled([
    notificationPromise,
    activityPromise,
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error(
        "Rezultāts saglabāts, bet saistīto notikumu neizdevās izveidot:",
        result.reason
      );
    }
  }
}

export async function saveMatchResult(
  matchId: string,
  sets: SaveMatchSetInput[]
): Promise<SaveMatchResultResponse> {
  try {
    const normalizedMatchId = matchId.trim();

    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    const identity = await getCurrentIdentity();

    if (!identity) {
      throw new Error(
        "Lai saglabātu rezultātu, nepieciešams ielogoties."
      );
    }

    const matchService = await createMatchService();

    const existingMatch =
      await matchService.getMatchById(normalizedMatchId);

    if (!existingMatch) {
      throw new Error("Spēle nav atrasta.");
    }

    const isParticipant =
      identity.playerId === existingMatch.player_one_id ||
      identity.playerId === existingMatch.player_two_id;

    const isAdmin = identity.isAdmin;

    if (!isParticipant && !isAdmin) {
      throw new Error(
        "Rezultātu drīkst ievadīt vai labot tikai spēles dalībnieks vai administrators."
      );
    }

    if (
      existingMatch.status === "completed" &&
      existingMatch.result_type === "regular" &&
      isSameResult(existingMatch.sets, sets)
    ) {
      return {
        success: true,
        changed: false,
        message: "Rezultāts nav mainīts.",
      };
    }

    const hadExistingResult =
      existingMatch.status === "completed" ||
      existingMatch.sets.length > 0 ||
      existingMatch.winner_id !== null;

    const oldSnapshot =
      createResultSnapshot(existingMatch);

    await matchService.saveResult({
      matchId: normalizedMatchId,
      enteredByUserId: identity.userId,
      sets,
    });

    const updatedMatch =
      await matchService.getMatchById(normalizedMatchId);

    if (!updatedMatch) {
      throw new Error(
        "Rezultāts saglabāts, bet neizdevās ielādēt atjaunināto spēli."
      );
    }

    const newSnapshot =
      createResultSnapshot(updatedMatch);

    const matchHistoryService =
      await createMatchHistoryService();

    await matchHistoryService.createEntry({
      matchId: normalizedMatchId,
      userId: identity.userId,
      action: hadExistingResult
        ? "result_updated"
        : "result_created",
      oldValue: oldSnapshot as Json,
      newValue: newSnapshot as Json,
    });

    await createResultEvents({
      hadExistingResult,
      actorUserId: identity.userId,
      actorName: identity.fullName,
      match: updatedMatch,
    });

    revalidateMatchPages(
      normalizedMatchId,
      existingMatch.tournament_id
    );

    return {
      success: true,
      changed: true,
      message: hadExistingResult
        ? "Rezultāts veiksmīgi izlabots."
        : "Rezultāts veiksmīgi saglabāts.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Neizdevās saglabāt rezultātu.",
    };
  }
}
