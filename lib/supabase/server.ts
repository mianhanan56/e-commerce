import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "./env";
import type { Database } from "./types";

// Session-aware client for the admin portal: queries run as the signed-in user, so
// database row-level security decides what they can see and change.
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. proxy.ts refreshes
          // the session on every admin request, so this write can be skipped.
        }
      },
    },
  });
}
