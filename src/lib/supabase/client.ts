import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Trūkst NEXT_PUBLIC_SUPABASE_URL vērtības .env.local failā."
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Trūkst NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY vērtības .env.local failā."
    );
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey
  );
}