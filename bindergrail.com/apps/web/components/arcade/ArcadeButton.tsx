import Link from "next/link";
import type { ReactNode } from "react";
import { DROP } from "./ui";

type Variant = "primary" | "blue" | "outline" | "danger";
type Size = "md" | "sm";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gold-400 text-ink-950 border-ink-950 shadow-[inset_-4px_-4px_0_var(--color-gold-700),4px_4px_0_var(--color-ink-950)]",
  blue: "bg-blue-400 text-ink-950 border-ink-950 shadow-[inset_-4px_-4px_0_var(--color-blue-700),4px_4px_0_var(--color-ink-950)]",
  outline: `bg-ink-800 text-cream-100 border-cream-100 ${DROP}`,
  danger: `bg-ink-800 text-red-400 border-red-400 ${DROP}`,
};

const DISABLED =
  "bg-ink-700 text-stone-400 border-ink-950 shadow-[4px_4px_0_var(--color-ink-950)] cursor-default";

const SIZE: Record<Size, string> = {
  md: "min-h-[56px] px-5 text-[13px]",
  sm: "min-h-[50px] px-4 text-[10px]",
};

const BASE =
  "inline-flex items-center justify-center gap-3 border-[3px] font-display leading-none no-underline";

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

export default function ArcadeButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
}: Props) {
  const cls = `${BASE} ${SIZE[size]} ${disabled ? DISABLED : VARIANT[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${cls} cursor-pointer disabled:cursor-default`}
    >
      {children}
    </button>
  );
}
