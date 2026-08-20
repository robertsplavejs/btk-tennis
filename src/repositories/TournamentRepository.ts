import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

export class TournamentRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async getAll() {
    const { data, error } = await this.supabase
      .from("tournaments")
      .select(`
        *,
        season:seasons(
          id,
          name
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("tournaments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getByPlayerId(playerId: string) {
    const { data, error } = await this.supabase
      .from("tournaments")
      .select(`
        *,
        season:seasons(
          id,
          name
        ),
        groups!inner(
          group_players!inner(
            player_id,
            status
          )
        )
      `)
      .eq("groups.group_players.player_id", playerId)
      .eq("groups.group_players.status", "active")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async create(
    tournament: Database["public"]["Tables"]["tournaments"]["Insert"]
  ) {
    const { data, error } = await this.supabase
      .from("tournaments")
      .insert(tournament)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(
    id: string,
    tournament: Database["public"]["Tables"]["tournaments"]["Update"]
  ) {
    const { data, error } = await this.supabase
      .from("tournaments")
      .update(tournament)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async delete(id: string) {
    const { data, error } = await this.supabase
      .from("tournaments")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
