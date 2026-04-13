"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--pm-white)",
        border: "0.5px solid var(--pm-gray-border)",
        borderRadius: 10,
        padding: "10px 16px",
        fontSize: 13,
        color: "var(--pm-ink)",
        zIndex: 200,
        whiteSpace: "nowrap",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}
    >
      {message}
    </div>
  );
}
