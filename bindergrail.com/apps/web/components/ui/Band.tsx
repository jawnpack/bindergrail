import type { ReactNode } from "react";
import { SURFACE_BG, HAIRLINE, type Surface } from "./surface";

// A full-width section on one surface. Each surface change is marked by a 1px
// hairline in the incoming surface's hairline token (a printed rule, not a hard
// color join). Rhythm alternates between `band-y` and `band-y-tight`.
export default function Band({
  surface = "cream",
  rhythm = "default",
  rule = true,
  reveal = true,
  id,
  className = "",
  labelledBy,
  children,
}: {
  surface?: Surface;
  rhythm?: "default" | "tight" | "none";
  rule?: boolean;
  reveal?: boolean;
  id?: string;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  const pad =
    rhythm === "default" ? "py-(--band-y)" : rhythm === "tight" ? "py-(--band-y-tight)" : "";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative ${SURFACE_BG[surface]} ${rule ? `border-t ${HAIRLINE[surface]}` : ""} ${pad} ${className}`}
    >
      {reveal ? <div data-reveal>{children}</div> : children}
    </section>
  );
}
