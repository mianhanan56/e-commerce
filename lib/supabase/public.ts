import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

// Anonymous client for storefront server actions. It has no session and can only call
// the public database functions (create_order, track_order, …) and read the catalogue.
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
