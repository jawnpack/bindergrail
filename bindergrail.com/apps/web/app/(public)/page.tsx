import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import GrainOverlay from "@/components/GrainOverlay";


export const metadata: Metadata = {
  title: "Binder Grail — Pokémon TCG Tools & Market Analysis for Frugal Collectors",
  description:
    "Binder Grail is the home for budget-conscious Pokémon TCG collectors. Market analysis, collecting tools, and the Common Rare newsletter — built to help you collect consciously.",
  openGraph: {
    title: "Binder Grail",
    description: "Pokémon TCG tools and market analysis for frugal collectors.",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
};

function TagPill({ tag }: { tag: string }) {
  const isMarket = tag === "Market";
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm"
      style={{
        backgroundColor: isMarket ? "rgba(176,112,53,0.12)" : "rgba(122,116,104,0.1)",
        color: isMarket ? "#B07035" : "#7A7468",
      }}
    >
      {tag}
    </span>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const listed = rest.slice(0, 4);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1A1814" }}>
        <GrainOverlay />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-6"
            style={{ color: "#B07035" }}
          >
            Pokémon TCG · For frugal collectors
          </p>
          <h1
            className="text-[42px] md:text-[64px] font-black leading-[1.08] tracking-tight mb-6 max-w-2xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            Collect{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>smarter.</span>
            <br />
            Spend less.
            <br />
            Chase your grail.
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-[300px] mb-10"
            style={{ color: "#7A7468" }}
          >
            Binder Grail is the home for budget-conscious Pokémon TCG collectors.
            Market analysis, collecting tools, and a weekly newsletter — built to
            help you collect consciously.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
            >
              Explore Binder Grail
            </Link>
            <a
              href="https://commonrare.bindergrail.com"
              className="text-[13px] hover:underline"
              style={{ color: "#7A7468" }}
            >
              Read Common Rare, our newsletter →
            </a>
          </div>
        </div>
      </section>

      {/* ── Latest Posts ──────────────────────────────────────────── */}
      <section className="flex-1 py-16 md:py-20" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-baseline justify-between mb-10">
            <h2
              className="text-[22px] font-bold"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
            >
              Latest
            </h2>
            <Link
              href="/blog"
              className="text-sm hover:underline"
              style={{ color: "#B07035" }}
            >
              All posts →
            </Link>
          </div>

          {/* Featured post card (dark) */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="block mb-8 group">
              <div
                className="relative overflow-hidden rounded-sm p-8 md:p-10"
                style={{ backgroundColor: "#1A1814" }}
              >
                <GrainOverlay />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <TagPill tag={featured.tag} />
                    <span className="text-[11px]" style={{ color: "#7A7468" }}>
                      {formatDate(featured.date)}
                    </span>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold leading-snug mb-3 group-hover:underline"
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      color: "#F5F0E8",
                    }}
                  >
                    {featured.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#7A7468" }}>
                    {featured.description}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Numbered post list */}
          <div className="flex flex-col divide-y" style={{ borderColor: "#D8D0C0" }}>
            {listed.map((post, i) => (
              <article key={post.slug} className="py-5 first:pt-0 last:pb-0 flex gap-5 items-start">
                <span
                  className="text-[32px] font-black leading-none select-none hidden sm:block shrink-0 w-10 text-right"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#D8D0C0",
                    fontStyle: "italic",
                  }}
                >
                  0{i + 2}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <TagPill tag={post.tag} />
                    <time className="text-[11px]" style={{ color: "#7A7468" }}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h3
                      className="text-[17px] font-bold leading-snug group-hover:underline"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
                    >
                      {post.title}
                    </h3>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apps coming soon ─────────────────────────────────────── */}
      <section className="py-14 md:py-16" style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid #D8D0C0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8">
            <h2
              className="text-[22px] font-bold"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
            >
              Tools
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {/* Origins card */}
            <Link
              href="/origins"
              className="block rounded-sm transition-shadow hover:shadow-sm"
              style={{
                backgroundColor: "#E8E4DC",
                border: "1px solid #C8C0B0",
                borderLeft: "4px solid #B07035",
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[20px] font-bold"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic", color: "#2C2A22" }}
                  >
                    Origins
                  </span>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: "#D8D0C0", color: "#7A6E5F" }}
                  >
                    Soon
                  </span>
                </div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#7A6E5F" }}
                >
                  a Binder Grail app
                </p>
                <div className="mb-3" style={{ borderTop: "1px solid #C8C0B0" }} />
                <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#2C2A22" }}>
                  Track every card you own. Log condition, price paid, and grading status — so you always know what&apos;s in your binder and what it&apos;s worth.
                </p>
                <span className="text-[13px] font-semibold" style={{ color: "#B07035" }}>
                  Learn more →
                </span>
              </div>
            </Link>

            {/* Pocket Money card */}
            <Link
              href="/pocket-money"
              className="block rounded-sm transition-shadow hover:shadow-sm"
              style={{
                backgroundColor: "#EAF0EB",
                border: "1px solid #C8D8CA",
                borderLeft: "4px solid #3D5C42",
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[20px] font-bold"
                    style={{ fontFamily: "var(--font-dm-sans), Arial, sans-serif", color: "#2A4230" }}
                  >
                    Pocket Money
                  </span>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: "#C8D8CA", color: "#3D5C42" }}
                  >
                    Soon
                  </span>
                </div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "#6A9470" }}
                >
                  a Binder Grail app
                </p>
                <div className="mb-3" style={{ borderTop: "1px solid #C8D8CA" }} />
                <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#2A4230" }}>
                  Set a monthly Pokémon budget, log every purchase, and track holds so you never blow past your limit. Built for collectors who take spending seriously.
                </p>
                <span className="text-[13px] font-semibold" style={{ color: "#3D5C42" }}>
                  Learn more →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter strip ──────────────────────────────────────── */}
      <section id="newsletter" className="relative overflow-hidden" style={{ backgroundColor: "#1A1814" }}>
        <GrainOverlay />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Common Rare logo */}
          <div className="mb-5">
            <Image
              src="/images/common_rare_logo.png"
              alt="Common Rare"
              height={80}
              width={240}
              style={{ filter: "brightness(0) invert(0.9)", height: 80, width: "auto" }}
            />
          </div>

          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#B07035" }}
          >
            Common Rare · A Binder Grail newsletter
          </p>
          <h2
            className="text-[28px] md:text-[36px] font-bold leading-tight mb-3 max-w-xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            The weekly read for{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>frugal</span> collectors.
          </h2>
          <p className="text-[14px] max-w-md mb-7" style={{ color: "#7A7468" }}>
            Market moves, restock alerts, and a plain verdict on every new
            Pokémon TCG product. Free, every week.
          </p>
          <a
            href="https://commonrare.bindergrail.com"
            className="inline-block rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Subscribe to Common Rare
          </a>
          <p className="mt-4 text-[11px]" style={{ color: "#7A7468" }}>
            Free, every week. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
