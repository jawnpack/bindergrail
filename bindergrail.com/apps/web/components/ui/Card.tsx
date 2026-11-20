import Link from "next/link";
import type { ReactNode } from "react";
import { HAIRLINE, RAISED, type Surface } from "./surface";

// The one card primitive. Hairline, 4px radius, no shadow. Hover is the whole
// treatment: the hairline turns amber and the card lifts 2px.
export default function Card({
  surface = "cream",
  href,
  prefetch,
  className = "",
  children,
}: {
  surface?: Surface;
  href?: string;
  prefetch?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls =
    `block rounded-md border ${HAIRLINE[surface]} ${RAISED[surface]} ` +
    "transition-[border-color,transform] duration-(--dur) ease-almanac " +
    (href ? "hover:-translate-y-0.5 hover:border-amber focus-visible:border-amber " : "") +
    className;
  if (!href) return <div className={cls}>{children}</div>;
  const native = /^(https?:|mailto:)/.test(href) || href.startsWith("/games/");
  return native ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} prefetch={prefetch} className={cls}>
      {children}
    </Link>
  );
}
