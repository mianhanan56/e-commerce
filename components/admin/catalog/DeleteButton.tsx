"use client";

import { useState, useTransition } from "react";
import type { CatalogResult } from "@/lib/actions/catalog";
import ui from "../Admin.module.scss";
import styles from "./CatalogForm.module.scss";

// `action` is a bound server action (e.g. deleteProduct.bind(null, id)); it redirects on
// success and returns an error otherwise.
export function DeleteButton({
  action,
  label,
  confirm,
}: {
  action: () => Promise<CatalogResult>;
  label: string;
  confirm: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const onClick = () => {
    if (!window.confirm(confirm)) return;
    startTransition(async () => {
      setError("");
      const result = await action();
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <>
      <button
        type="button"
        className={`${ui.btn} ${styles.dangerBtn}`}
        onClick={onClick}
        disabled={pending}
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
