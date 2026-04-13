"use client";

import { useState } from "react";

type Props = {
  app: "origins" | "pocket-money";
  buttonColor?: string;
  inputBg?: string;
  inputBorder?: string;
};

export default function WaitlistForm({
  app,
  buttonColor = "#B07035",
  inputBg = "#2C2920",
  inputBorder = "rgba(255,255,255,0.1)",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, app }),
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
        You&apos;re on the list. We&apos;ll email you at launch.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-sm px-4 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: inputBg,
            color: "#F5F0E8",
            border: `1px solid ${inputBorder}`,
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60 whitespace-nowrap"
          style={{ backgroundColor: buttonColor, color: "#F5F0E8" }}
        >
          {status === "loading" ? "Joining…" : "Notify me"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs" style={{ color: "#B07035" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
