"use client";

import { useState } from "react";
import Link from "next/link";
import GrainOverlay from "@/components/GrainOverlay";

const FEATURES = [
  {
    title: "Full Sleeper List",
    desc: "10 undervalued cards per week with PSA pop and price vs historical high data.",
  },
  {
    title: "Premium market alerts",
    desc: "Buying windows and restock signals — delivered when timing matters.",
  },
  {
    title: "Everything in the free newsletter, plus the alpha",
    desc: "All regular Common Rare issues plus the premium layer on top.",
  },
];

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tag: "premium_waitlist" }),
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
        You&apos;re on the list. We&apos;ll email you when premium launches.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-2 max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-sm px-4 py-2.5 text-sm outline-none"
        style={{
          backgroundColor: "#2C2920",
          color: "#F5F0E8",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60 whitespace-nowrap"
        style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
      >
        {status === "loading" ? "Joining…" : "Notify me"}
      </button>
      {status === "error" && (
        <p className="text-xs w-full" style={{ color: "#B07035" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

export default function UpgradePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1A1814" }}>
        <GrainOverlay />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#B07035" }}
          >
            Common Rare · Premium
          </p>
          <h1
            className="text-[36px] md:text-[52px] font-black leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            Common Rare{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>Premium</span>
          </h1>
          <p
            className="text-[22px] font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#7A7468" }}
          >
            Coming soon
          </p>
          <p className="text-[15px] leading-relaxed max-w-lg mb-10" style={{ color: "#7A7468" }}>
            Exclusive sleeper card coverage, key buying moments, and market alerts —
            delivered every week.
          </p>

          <div className="mb-3">
            <p className="text-[13px] font-semibold mb-4" style={{ color: "#F5F0E8" }}>
              Get notified when premium launches
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="flex-1 py-16" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2
            className="text-[22px] font-bold mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
          >
            What&apos;s included
          </h2>
          <div className="flex flex-col gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 rounded-sm border"
                style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
              >
                <span className="text-[18px] mt-0.5" style={{ color: "#B07035" }}>·</span>
                <div>
                  <p
                    className="text-[15px] font-semibold mb-1"
                    style={{ color: "#1A1814" }}
                  >
                    {f.title}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#7A7468" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[13px]" style={{ color: "#7A7468" }}>
            Already have an account?{" "}
            <Link href="/account" className="hover:underline" style={{ color: "#1A1814" }}>
              Go to your account
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
