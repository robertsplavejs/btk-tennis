import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export type TypedSupabaseClient =
  SupabaseClient<Database>;

export abstract class BaseRepository {
  constructor(
    protected readonly supabase: TypedSupabaseClient
  ) {}
}