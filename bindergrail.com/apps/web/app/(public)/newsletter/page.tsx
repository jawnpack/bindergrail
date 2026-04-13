import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIssues } from "@/lib/beehiiv";
import GrainOverlay from "@/components/GrainOverlay";
import NewsletterArchive from "./NewsletterArchive";

export const metadata: Metadata = {
  title: "Newsletter Archive | Binder Grail",
  description: "Every issue of Common Rare — Pokémon TCG market analysis and buying advice for frugal collectors.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const [supabase, issues] = await Promise.all([
    createClient(),
    getIssues(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);
  const count = issues.length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A1814" }}
      >
        <GrainOverlay />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-20">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#B07035" }}
          >
            Common Rare · Issue archive
          </p>
          <h1
            className="text-[36px] md:text-[52px] font-black leading-tight tracking-tight mb-3 max-w-2xl"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5F0E8",
            }}
          >
            Every{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>issue,</span>{" "}
            one place.
          </h1>
          <p className="text-[15px]" style={{ color: "#7A7468" }}>
            {count > 0
              ? `${count} issue${count === 1 ? "" : "s"} of market analysis, buying advice, and restock alerts.`
              : "Market analysis, buying advice, and restock alerts."}
          </p>
        </div>
      </section>

      {/* ── Archive body ────────────────────────────────────────── */}
      <NewsletterArchive issues={issues} isLoggedIn={isLoggedIn} />
    </>
  );
}
