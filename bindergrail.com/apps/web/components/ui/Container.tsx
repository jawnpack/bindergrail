import type { ReactNode } from "react";

// Three widths: prose (article column), content (standard band), wide (hero,
// galleries). Gutters scale with the viewport.
const WIDTH = {
  prose: "max-w-prose",
  content: "max-w-content",
  wide: "max-w-wide",
} as const;

export default function Container({
  width = "content",
  className = "",
  children,
}: {
  width?: keyof typeof WIDTH;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full px-(--gutter) ${WIDTH[width]} ${className}`}>
      {children}
    </div>
  );
}
