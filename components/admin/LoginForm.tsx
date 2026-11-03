"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/admin";
import ui from "./Admin.module.scss";
import styles from "./LoginForm.module.scss";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className={styles.form}>
      <div>
        <label htmlFor="admin-email" className={ui.label}>
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
          className={ui.input}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className={ui.label}>
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={ui.input}
        />
      </div>
      {state && (
        <p className={ui.error} role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className={ui.btn} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className={styles.hint}>
        Admin accounts are created by the store owner in Supabase. There is no public sign-up.
      </p>
    </form>
  );
}
