import "server-only";

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/supabase/types";

export type Admin = { id: string; email: string; name: string; role: AdminRole };

// Verified with the Auth server (getUser), then checked against public.admins.
// Cached per request so layouts, pages and actions share one lookup.
export const getAdmin = cache(async (): Promise<Admin | null> => {
  // Always per request, even before Supabase is configured, so no admin page is prerendered.
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("name, role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;

  return { id: user.id, email: user.email ?? "", name: data.name, role: data.role };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
