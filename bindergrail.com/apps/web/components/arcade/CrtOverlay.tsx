"use client";

import { useSyncExternalStore } from "react";

// Scanline layer over the whole arcade. Per-viewer on/off in localStorage; must
// render correctly without storage, so it defaults ON and only turns off when a
// stored preference says so. aria-hidden and never blocks taps.
const KEY = "bg-arcade-crt";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true; // private mode / blocked storage — keep it on.
  }
}

// Server (and first paint) default: on.
function getServerSnapshot(): boolean {
  return true;
}

export default function CrtOverlay() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!on) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.22)_0px,rgba(0,0,0,0.22)_1px,transparent_1px,transparent_3px)]"
    />
  );
}
