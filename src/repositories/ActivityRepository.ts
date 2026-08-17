import type { ActivityDraft } from "@/core/activity/types";
import { BaseRepository } from "@/repositories/BaseRepository";

export class ActivityRepository extends BaseRepository {
  async create(activity: ActivityDraft) {
    const { data, error } = await this.supabase.rpc(
      "create_activity",
      {
        target_activity_type: activity.activityType,
        target_title: activity.title,
        target_description: activity.description,
        target_icon: activity.icon,
        target_color: activity.color,
        target_metadata: activity.metadata ?? {},
        target_tournament_id:
          activity.tournamentId ?? undefined,
        target_match_id:
          activity.matchId ?? undefined,
      }
    );

    if (error) {
      throw new Error(
        `Neizdevās izveidot aktivitāti: ${error.message}`
      );
    }

    return data;
  }

  async getLatest(limit = 20) {
    const safeLimit = Math.min(
      Math.max(Math.trunc(limit), 1),
      100
    );

    const { data, error } = await this.supabase
      .from("activities")
      .select(`
        *,
        actor:players!activities_actor_player_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        ),
        tournament:tournaments(
          id,
          name,
          slug
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(safeLimit);

    if (error) {
      throw new Error(
        `Neizdevās ielādēt aktivitātes: ${error.message}`
      );
    }

    return data;
  }

  async getByTournamentId(
    tournamentId: string,
    limit = 20
  ) {
    const safeLimit = Math.min(
      Math.max(Math.trunc(limit), 1),
      100
    );

    const { data, error } = await this.supabase
      .from("activities")
      .select(`
        *,
        actor:players!activities_actor_player_id_fkey(
          id,
          full_name,
          initials,
          avatar_url
        ),
        tournament:tournaments(
          id,
          name,
          slug
        )
      `)
      .eq("tournament_id", tournamentId)
      .order("created_at", {
        ascending: false,
      })
      .limit(safeLimit);

    if (error) {
      throw new Error(
        `Neizdevās ielādēt turnīra aktivitātes: ${error.message}`
      );
    }

    return data;
  }
}