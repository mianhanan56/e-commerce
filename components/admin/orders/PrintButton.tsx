"use client";

import ui from "../Admin.module.scss";

export function PrintButton({ label = "Print packing slip" }: { label?: string }) {
  return (
    <button type="button" className={`${ui.btn} ${ui.btnGhost}`} onClick={() => window.print()}>
      {label}
    </button>
  );
}
