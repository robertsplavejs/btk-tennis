import { BaseRepository } from "@/repositories/BaseRepository";
import type { Database } from "@/types/database";

export class SeasonRepository extends BaseRepository {
  async getAll() {
    const { data, error } = await this.supabase
      .from("seasons")
      .select("*")
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
      .from("seasons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async create(
    season: Database["public"]["Tables"]["seasons"]["Insert"]
  ) {
    const { data, error } = await this.supabase
      .from("seasons")
      .insert(season)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(
    id: string,
    season: Database["public"]["Tables"]["seasons"]["Update"]
  ) {
    const { data, error } = await this.supabase
      .from("seasons")
      .update(season)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}