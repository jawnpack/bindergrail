import type { ReactNode } from "react";
import Kicker from "./Kicker";
import { MUTED, type Surface } from "./surface";

// kicker → h2 → lead, with fixed spacing. Every band uses it, which is what
// makes the page read as one system instead of eight.
export default function SectionHeader({
  kicker,
  title,
  lead,
  surface = "cream",
  as: Tag = "h2",
  id,
  size = "l",
  className = "",
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  surface?: Surface;
  as?: "h1" | "h2";
  id?: string;
  size?: "xl" | "l" | "m";
  className?: string;
}) {
  const t = size === "xl" ? "text-display-xl" : size === "m" ? "text-display-m" : "text-display-l";
  return (
    <header className={className}>
      {kicker ? (
        <Kicker surface={surface} className="mb-4">
          {kicker}
        </Kicker>
      ) : null}
      <Tag id={id} className={`font-serif ${t} text-balance`}>
        {title}
      </Tag>
      {lead ? (
        <p className={`mt-5 max-w-measure-lead text-lead text-pretty ${MUTED[surface]}`}>{lead}</p>
      ) : null}
    </header>
  );
}
