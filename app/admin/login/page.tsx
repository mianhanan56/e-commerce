import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Wordmark } from "@/components/layout/Wordmark";
import { getAdmin } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/LoginForm.module.scss";

export const metadata: Metadata = { title: "Sign in" };

// Reads the session to skip the form for signed-in admins, so it always renders per request.
export const instant = false;

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <Wordmark />
        <h1 className={styles.title}>Admin sign in</h1>
        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <p className={ui.notice}>
            Supabase isn&apos;t connected yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code> (see{" "}
            <code>supabase/README.md</code>), then restart the dev server.
          </p>
        )}
      </div>
    </div>
  );
}
