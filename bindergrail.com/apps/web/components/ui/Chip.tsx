import type { ReactNode } from "react";
import { HAIRLINE, RAISED, type Surface } from "./surface";

// Spec pill: label step, caps, hairline, tight radius, and a small amber tick —
// a deliberate device rather than a default bordered box.
export default function Chip({
  surface = "cream",
  children,
}: {
  surface?: Surface;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-sm border px-2.5 text-label uppercase ${HAIRLINE[surface]} ${RAISED[surface]}`}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-amber" />
      {children}
    </span>
  );
}
