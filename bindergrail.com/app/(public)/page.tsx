import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import GrainOverlay from "@/components/GrainOverlay";
import SubscribeForm from "@/components/SubscribeForm";

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
            Pokémon TCG · Market &amp; Collecting
          </p>
          <h1
            className="text-[42px] md:text-[64px] font-black leading-[1.08] tracking-tight mb-6 max-w-2xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            Collect smarter.{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>
              Chase your grail.
            </span>
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-md mb-10"
            style={{ color: "#7A7468" }}
          >
            Honest Pokémon TCG market analysis and frugal collecting strategy — no hype, no filler.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#newsletter"
              className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
            >
              Subscribe free
            </Link>
            <Link
              href="/blog"
              className="rounded-sm px-5 py-2.5 text-sm font-semibold border transition-colors hover:border-white/40"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#F5F0E8" }}
            >
              Browse posts
            </Link>
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

      {/* ── Newsletter strip ──────────────────────────────────────── */}
      <section id="newsletter" className="relative overflow-hidden" style={{ backgroundColor: "#1A1814" }}>
        <GrainOverlay />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-20">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#B07035" }}
          >
            Common Rare · Free newsletter
          </p>
          <h2
            className="text-[28px] md:text-[36px] font-bold leading-tight mb-3 max-w-xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            The weekly read for{" "}
            <span style={{ fontStyle: "italic", color: "#B07035" }}>frugal</span> collectors.
          </h2>
          <p className="text-[14px] max-w-md mb-7" style={{ color: "#7A7468" }}>
            Market takes, sealed product strategy, and grading insights — delivered when there's something worth saying.
          </p>
          <SubscribeForm />
          <p className="mt-4 text-[11px]" style={{ color: "#7A7468" }}>
            Weekly-ish. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
