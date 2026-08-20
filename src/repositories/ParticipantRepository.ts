import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

type GroupPlayerInsert =
  Database["public"]["Tables"]["group_players"]["Insert"];

export class ParticipantRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async getMainGroupByTournamentId(tournamentId: string) {
    const { data, error } = await this.supabase
      .from("groups")
      .select("id, tournament_id, name, slug")
      .eq("tournament_id", tournamentId)
      .eq("slug", "main")
      .maybeSingle();

    if (error) {
      throw new Error(
        `Neizdevās ielādēt turnīra grupu: ${error.message}`
      );
    }

    return data;
  }

  async getMainGroupsByTournamentIds(tournamentIds: string[]) {
    if (tournamentIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from("groups")
      .select("id, tournament_id, name, slug")
      .in("tournament_id", tournamentIds)
      .eq("slug", "main");

    if (error) {
      throw new Error(
        `Neizdevās ielādēt turnīru grupas: ${error.message}`
      );
    }

    return data;
  }

  async getByGroupId(groupId: string) {
    const { data, error } = await this.supabase
      .from("group_players")
      .select(`
        id,
        group_id,
        player_id,
        seed,
        status,
        joined_at,
        player:players!group_players_player_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        )
      `)
      .eq("group_id", groupId)
      .eq("status", "active")
      .order("joined_at", {
        ascending: true,
      });

    if (error) {
      throw new Error(
        `Neizdevās ielādēt dalībniekus: ${error.message}`
      );
    }

    return data;
  }

  async getByGroupIds(groupIds: string[]) {
    if (groupIds.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from("group_players")
      .select(`
        id,
        group_id,
        player_id,
        seed,
        status,
        joined_at,
        player:players!group_players_player_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        )
      `)
      .in("group_id", groupIds)
      .eq("status", "active")
      .order("joined_at", { ascending: true });

    if (error) {
      throw new Error(
        `Neizdevās ielādēt dalībniekus: ${error.message}`
      );
    }

    return data;
  }

  async addMany(groupId: string, playerIds: string[]) {
    const rows: GroupPlayerInsert[] = playerIds.map(
      (playerId) => ({
        group_id: groupId,
        player_id: playerId,
        status: "active",
      })
    );

    const { data, error } = await this.supabase
      .from("group_players")
      .insert(rows)
      .select();

    if (error) {
      throw new Error(
        `Neizdevās pievienot dalībniekus: ${error.message}`
      );
    }

    return data;
  }

  async removeActiveMembership(
    groupId: string,
    playerId: string
  ) {
    const leftAt = new Date().toISOString();

    const { data, error } = await this.supabase
      .from("group_players")
      .update({
        status: "removed",
        left_at: leftAt,
        updated_at: leftAt,
      })
      .eq("group_id", groupId)
      .eq("player_id", playerId)
      .eq("status", "active")
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(
        `Neizdevās noņemt dalībnieku: ${error.message}`
      );
    }

    return data;
  }
}
