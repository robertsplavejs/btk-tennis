import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

export class PlayerRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async getAll() {
    const { data, error } = await this.supabase
      .from("players")
      .select("*")
      .order("full_name");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
