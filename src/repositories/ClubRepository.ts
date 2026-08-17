import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

export class ClubRepository {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  async getAll() {
    const { data, error } = await this.supabase
      .from("clubs")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Neizdevās ielādēt klubus: ${error.message}`);
    }

    return data;
  }

  async getBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from("clubs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Neizdevās ielādēt klubu: ${error.message}`);
    }

    return data;
  }
}