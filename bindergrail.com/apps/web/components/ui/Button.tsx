import Link from "next/link";
import type { ReactNode } from "react";

// Four variants, all 44px+ tall with the global focus ring. Hover changes
// background/border only — never a transform.
//  primary        amber-bright fill, ink text (6.1:1) — for dark surfaces
//  primary-light  amber-deep fill, cream text (5.3:1) — for cream/parchment
//  secondary      transparent, 1px hairline in the current color; amber on hover
//  quiet          text + arrow; underline grows on hover
type Variant = "primary" | "primary-light" | "secondary" | "quiet";

const VARIANT: Record<Variant, string> = {
  primary: "bg-amber-bright text-ink hover:bg-amber-bright-hover px-5",
  "primary-light": "bg-amber-deep text-cream hover:bg-amber-deep-hover px-5",
  secondary: "border border-current/30 hover:border-amber px-5",
  quiet: "px-0 gap-2",
};

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm text-ui font-medium " +
  "transition-[background-color,border-color] duration-(--dur-fast) ease-almanac";

export default function Button({
  href,
  variant = "primary",
  arrow = false,
  prefetch,
  className = "",
  type = "button",
  onClick,
  disabled,
  children,
}: {
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  prefetch?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const quiet = variant === "quiet";
  const cls = `${BASE} ${VARIANT[variant]} ${disabled ? "opacity-60 pointer-events-none" : ""} ${className}`;
  const inner = (
    <>
      <span className={quiet ? "link-grow" : ""}>{children}</span>
      {arrow || quiet ? <span aria-hidden="true">→</span> : null}
    </>
  );

  if (href) {
    // External links and the static games (/games/*, plain HTML) use <a>.
    const native = /^(https?:|mailto:)/.test(href) || href.startsWith("/games/");
    return native ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} prefetch={prefetch} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
