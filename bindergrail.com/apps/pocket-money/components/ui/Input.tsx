"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, style, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--pm-ink)",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${error ? "var(--pm-red-mid)" : "var(--pm-gray-border)"}`,
          backgroundColor: "#fff",
          color: "var(--pm-ink)",
          fontSize: 15,
          fontWeight: 400,
          outline: "none",
          width: "100%",
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span style={{ fontSize: 12, color: "var(--pm-red-mid)" }}>{error}</span>
      )}
    </div>
  );
}
