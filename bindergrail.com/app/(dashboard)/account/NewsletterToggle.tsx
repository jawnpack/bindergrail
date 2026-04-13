"use client";

import { useState } from "react";

export default function NewsletterToggle({
  initialSubscribed,
}: {
  initialSubscribed: boolean;
}) {
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function toggle() {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscribed: !subscribed }),
      });
      if (res.ok) {
        setSubscribed((prev) => !prev);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {/* Toggle track */}
        <button
          role="switch"
          aria-checked={subscribed}
          onClick={toggle}
          disabled={status === "loading"}
          className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60"
          style={{ backgroundColor: subscribed ? "#B07035" : "#D8D0C0" }}
        >
          {/* Thumb */}
          <span
            className="inline-block h-5 w-5 rounded-full shadow transition-transform duration-200 mt-0.5"
            style={{
              backgroundColor: "#F5F0E8",
              transform: subscribed ? "translateX(22px)" : "translateX(2px)",
            }}
          />
        </button>
        <span className="text-[14px]" style={{ color: "#1A1814" }}>
          {subscribed ? "Receiving weekly issues" : "Not subscribed"}
        </span>
      </div>
      {status === "error" && (
        <p className="mt-2 text-[12px]" style={{ color: "#B07035" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
