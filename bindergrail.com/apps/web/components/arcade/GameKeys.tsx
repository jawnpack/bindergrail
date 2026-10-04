"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Shared keyboard map bound by GameShell: Esc returns to the lobby. Games layer
// their own keys (Enter = confirm/next, arrows = move) on top in their own code.
export default function GameKeys() {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/arcade");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
