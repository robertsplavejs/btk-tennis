import { MatchHistoryRepository } from "@/repositories/MatchHistoryRepository";
import type { Json } from "@/types/database";

export type MatchHistoryAction =
  | "result_created"
  | "result_updated"
  | "schedule_created"
  | "schedule_updated"
  | "walkover"
  | "retired"
  | "cancelled";

type CreateMatchHistoryInput = {
  matchId: string;
  userId: string | null;
  action: MatchHistoryAction;
  oldValue?: Json | null;
  newValue?: Json | null;
};

export class MatchHistoryService {
  constructor(
    private readonly matchHistoryRepository: MatchHistoryRepository
  ) {}

  async createEntry(input: CreateMatchHistoryInput) {
    const matchId = input.matchId.trim();

    if (!matchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    const userId = input.userId?.trim() || null;

    return this.matchHistoryRepository.create({
      match_id: matchId,
      user_id: userId,
      action: input.action,
      old_value: input.oldValue ?? null,
      new_value: input.newValue ?? null,
    });
  }

  async getMatchHistory(matchId: string) {
    const normalizedMatchId = matchId.trim();

    if (!normalizedMatchId) {
      throw new Error("Spēles ID nav norādīts.");
    }

    return this.matchHistoryRepository.getByMatchId(
      normalizedMatchId
    );
  }
}