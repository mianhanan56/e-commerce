"use client";

import { useState, useTransition } from "react";
import { setMessageHandled } from "@/lib/actions/admin";
import ui from "../Admin.module.scss";
import styles from "./Messages.module.scss";

export function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const toggle = () =>
    startTransition(async () => {
      setError("");
      const result = await setMessageHandled(id, !handled);
      if (!result.ok) setError(result.error);
    });

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={`${ui.btn} ${handled ? ui.btnGhost : ""}`}
        onClick={toggle}
        disabled={pending}
      >
        {pending ? "Saving…" : handled ? "Reopen" : "Mark as handled"}
      </button>
      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
