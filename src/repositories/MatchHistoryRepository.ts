import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

type MatchHistoryInsert =
  Database["public"]["Tables"]["match_history"]["Insert"];

export class MatchHistoryRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async create(entry: MatchHistoryInsert) {
    const { data, error } = await this.supabase
      .from("match_history")
      .insert(entry)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Neizdevās saglabāt spēles vēsturi: ${error.message}`
      );
    }

    return data;
  }

  async getByMatchId(matchId: string) {
    const { data, error } = await this.supabase
      .from("match_history")
      .select(`
        *,
        user:user_accounts(
          player:players(
            id,
            full_name,
            initials
          )
        )
      `)
      .eq("match_id", matchId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `Neizdevās ielādēt spēles vēsturi: ${error.message}`
      );
    }

    return data;
  }
}
