import type { ReactNode } from "react";
import { AMBER_TEXT, type Surface } from "./surface";

// The one kicker style: label step, caps, 0.12em tracking, amber text in the
// tone that passes on its surface.
export default function Kicker({
  surface = "cream",
  as: Tag = "p",
  className = "",
  children,
}: {
  surface?: Surface;
  as?: "p" | "span" | "div";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`text-label uppercase ${AMBER_TEXT[surface]} ${className}`}>{children}</Tag>
  );
}
