"use client";

import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

// A localStorage-backed value shared across components and tabs. Reads go through
// useSyncExternalStore so the server render (and hydration) always sees `initial`.
export function createPersistedStore<T>(key: string, initial: T) {
  let value = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {
      // Private mode or corrupted JSON: fall back to the initial value.
    }
  };

  const emit = () => listeners.forEach((l) => l());

  return {
    get: () => {
      load();
      return value;
    },
    getServer: () => initial,
    set: (next: Updater<T>) => {
      load();
      value = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage full or blocked; state still updates for this session.
      }
      emit();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        loaded = false;
        load();
        emit();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export type PersistedStore<T> = ReturnType<typeof createPersistedStore<T>>;

export function usePersisted<T>(store: PersistedStore<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

const noopSubscribe = () => () => {};

// False during SSR and hydration, true afterwards — for UI that depends on stored state.
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
