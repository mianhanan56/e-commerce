"use client";

import { useEffect } from "react";

let locks = 0;

// Locks page scroll while any overlay (menu, search, cart) is open. Counted so that
// overlapping overlays don't unlock each other.
export function useBodyLock(active: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.classList.add("isLocked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onEscape?.();
    window.addEventListener("keydown", onKey);
    return () => {
      locks -= 1;
      if (locks === 0) document.body.classList.remove("isLocked");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onEscape]);
}
