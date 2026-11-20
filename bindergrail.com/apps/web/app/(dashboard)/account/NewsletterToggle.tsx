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
        {/* The 44px hit area wraps a 24px track. */}
        <button
          type="button"
          role="switch"
          aria-checked={subscribed}
          aria-labelledby="nl-toggle-label"
          onClick={toggle}
          disabled={status === "loading"}
          className="group -m-2.5 inline-flex size-11 w-16 shrink-0 items-center justify-center rounded-full disabled:opacity-60"
        >
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-(--dur-fast) ${
              subscribed ? "border-amber-deep bg-amber-deep" : "border-cream-hairline bg-cream-hairline"
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-cream transition-transform duration-(--dur-fast) ${
                subscribed ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
        <span id="nl-toggle-label" className="text-ui text-on-cream">
          {subscribed ? "Receiving weekly issues" : "Not subscribed"}
        </span>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-meta font-medium text-on-cream">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
