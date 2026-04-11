"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm font-medium" style={{ color: "#B07035" }}>
        You&apos;re in. Check your inbox for a welcome email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: "#F5F0E8",
          color: "#1A1814",
          border: "1px solid #D8D0C0",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60 whitespace-nowrap"
        style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
      >
        {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
      </button>
      {status === "error" && (
        <p className="text-xs w-full" style={{ color: "#B07035" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
