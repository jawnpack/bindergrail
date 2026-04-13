"use client";

import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--pm-green-mid)",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "var(--pm-gray-bg)",
    color: "var(--pm-ink)",
    border: "1px solid var(--pm-gray-border)",
  },
  danger: {
    backgroundColor: "var(--pm-red-mid)",
    color: "#fff",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--pm-green-dark)",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: "13px", borderRadius: "8px" },
  md: { padding: "10px 20px", fontSize: "15px", borderRadius: "10px" },
  lg: { padding: "14px 24px", fontSize: "16px", borderRadius: "12px" },
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        width: fullWidth ? "100%" : undefined,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        border: variantStyles[variant].border ?? "none",
        transition: "opacity 0.15s",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
