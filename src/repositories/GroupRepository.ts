import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

export class GroupRepository {
  constructor(
    private readonly supabase: TypedSupabaseClient
  ) {}

  async create(
    group: Database["public"]["Tables"]["groups"]["Insert"]
  ) {
    const { data, error } = await this.supabase
      .from("groups")
      .insert(group)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}