"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { CatalogResult } from "@/lib/actions/catalog";
import ui from "../Admin.module.scss";
import styles from "./CatalogForm.module.scss";

// Submits the form through `action` without React's automatic form reset, so a failed save
// keeps everything typed (and the picked photo). Creating redirects; editing returns the
// saved image URL.
export function useCatalogSave(action: (fd: FormData) => Promise<CatalogResult>) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<CatalogResult | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      setResult(await action(fd));
    });
  };

  return { pending, result, onSubmit };
}

export function SaveBar({
  pending,
  result,
  label,
  cancelHref,
}: {
  pending: boolean;
  result: CatalogResult | null;
  label: string;
  cancelHref: string;
}) {
  return (
    <div className={styles.actions}>
      <button type="submit" className={ui.btn} disabled={pending}>
        {pending ? "Saving…" : label}
      </button>
      <Link href={cancelHref} className={`${ui.btn} ${ui.btnGhost}`}>
        Back to list
      </Link>
      {!pending && result && (
        <p className={result.ok ? ui.success : ui.error} role={result.ok ? "status" : "alert"}>
          {result.ok ? "Saved. The store is updated." : result.error}
        </p>
      )}
    </div>
  );
}
