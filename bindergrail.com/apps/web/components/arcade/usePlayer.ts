"use client";

import { useSyncExternalStore } from "react";

// Signed-in arcade state, fetched once per page load from /api/arcade/me and
// shared by every widget that needs it (header HUD, top-bar tokens, best run).
// null until it arrives — which is also what the static HTML renders.
export type Player =
  | { signedIn: false }
  | { signedIn: true; tokens: number; streak: number; flipBest: number | null };

let player: Player | null = null;
let started = false;
const listeners = new Set<() => void>();

function load() {
  if (started) return;
  started = true;
  fetch("/api/arcade/me", { credentials: "same-origin" })
    .then((r) => (r.ok ? (r.json() as Promise<Player>) : { signedIn: false as const }))
    .catch(() => ({ signedIn: false as const }))
    .then((p) => {
      player = p;
      listeners.forEach((l) => l());
    });
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  load();
  return () => listeners.delete(onChange);
}

export function usePlayer(): Player | null {
  return useSyncExternalStore(
    subscribe,
    () => player,
    () => null
  );
}
