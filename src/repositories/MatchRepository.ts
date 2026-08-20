import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

type MatchInsert =
  Database["public"]["Tables"]["matches"]["Insert"];

type MatchUpdate =
  Database["public"]["Tables"]["matches"]["Update"];

type MatchSetInsert =
  Database["public"]["Tables"]["match_sets"]["Insert"];

export class MatchRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async createMany(matches: MatchInsert[]) {
    const { data, error } = await this.supabase
      .from("matches")
      .insert(matches)
      .select();

    if (error) {
      throw new Error(
        `Neizdevās izveidot spēles: ${error.message}`
      );
    }

    return data;
  }

  async getById(matchId: string) {
    const { data, error } = await this.supabase
      .from("matches")
      .select(`
        *,
        player_one:players!matches_player_one_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        ),
        player_two:players!matches_player_two_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        ),
        winner:players!matches_winner_id_fkey(
          id,
          full_name
        ),
        tournament:tournaments(
          id,
          name,
          slug,
          status
        ),
        sets:match_sets(
          id,
          set_number,
          set_type,
          player_one_score,
          player_two_score,
          player_one_tiebreak_points,
          player_two_tiebreak_points
        )
      `)
      .eq("id", matchId)
      .order("set_number", {
        referencedTable: "match_sets",
        ascending: true,
      })
      .maybeSingle();

    if (error) {
      throw new Error(
        `Neizdevās ielādēt spēli: ${error.message}`
      );
    }

    return data;
  }

  async getByTournamentId(tournamentId: string) {
    const { data, error } = await this.supabase
      .from("matches")
      .select(`
        *,
        player_one:players!matches_player_one_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        player_two:players!matches_player_two_id_fkey(
          id,
          full_name,
          avatar_url
        ),
        sets:match_sets(
          id,
          set_number,
          set_type,
          player_one_score,
          player_two_score,
          player_one_tiebreak_points,
          player_two_tiebreak_points
        )
      `)
      .eq("tournament_id", tournamentId)
      .order("round_number", {
        ascending: true,
      })
      .order("match_number", {
        ascending: true,
      })
      .order("set_number", {
        referencedTable: "match_sets",
        ascending: true,
      });

    if (error) {
      throw new Error(
        `Neizdevās ielādēt spēles: ${error.message}`
      );
    }

    return data;
  }

  async deleteSets(matchId: string) {
    const { error } = await this.supabase
      .from("match_sets")
      .delete()
      .eq("match_id", matchId);

    if (error) {
      throw new Error(
        `Neizdevās dzēst spēles setus: ${error.message}`
      );
    }
  }

  async replaceSets(
    matchId: string,
    sets: MatchSetInsert[]
  ) {
    await this.deleteSets(matchId);

    if (sets.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from("match_sets")
      .insert(sets)
      .select();

    if (error) {
      throw new Error(
        `Neizdevās saglabāt spēles setus: ${error.message}`
      );
    }

    return data;
  }

  async saveResultAtomically(
    matchId: string,
    sets: MatchSetInsert[]
  ) {
    const { data, error } = await this.supabase.rpc(
      "save_match_result",
      {
        target_match_id: matchId,
        submitted_sets: sets.map((set) => ({
          set_type: set.set_type ?? "regular",
          player_one_score: set.player_one_score,
          player_two_score: set.player_two_score,
          player_one_tiebreak_points:
            set.player_one_tiebreak_points ?? null,
          player_two_tiebreak_points:
            set.player_two_tiebreak_points ?? null,
        })),
      }
    );

    if (error) {
      throw new Error(
        `Neizdevās saglabāt spēles rezultātu: ${error.message}`
      );
    }

    return data;
  }

  async updateResult(
    matchId: string,
    result: MatchUpdate
  ) {
    const { data, error } = await this.supabase
      .from("matches")
      .update(result)
      .eq("id", matchId)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Neizdevās saglabāt spēles rezultātu: ${error.message}`
      );
    }

    return data;
  }

  async saveWalkoverAtomically(
    matchId: string,
    winnerId: string
  ) {
    const { data, error } = await this.supabase.rpc(
      "save_match_walkover",
      {
        target_match_id: matchId,
        selected_winner_id: winnerId,
      }
    );

    if (error) {
      throw new Error(
        `Neizdevās saglabāt tehnisko uzvaru: ${error.message}`
      );
    }

    return data;
  }
}
