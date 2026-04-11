import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getIssue } from "@/lib/beehiiv";
import GrainOverlay from "@/components/GrainOverlay";

export const dynamic = "force-dynamic";

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) return { title: "Issue Not Found | Binder Grail" };
  return {
    title: `${issue.title} | Common Rare`,
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const issue = await getIssue(id);
  if (!issue) notFound();

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A1814" }}
      >
        <GrainOverlay />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-14 md:py-18">
          {/* Back link */}
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest mb-8 transition-opacity hover:opacity-70"
            style={{ color: "#7A7468" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Archive
          </Link>

          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
            style={{ color: "#B07035" }}
          >
            Common Rare
          </p>

          <h1
            className="text-[32px] md:text-[44px] font-black leading-tight tracking-tight mb-4 max-w-2xl"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5F0E8",
            }}
          >
            {issue.title}
          </h1>

          <time
            className="text-[12px]"
            style={{ color: "#7A7468" }}
            dateTime={new Date(issue.date * 1000).toISOString()}
          >
            {formatDate(issue.date)}
          </time>
        </div>
      </section>

      {/* ── Issue body ──────────────────────────────────────────── */}
      <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-3xl mx-auto px-6">
          <article
            className="prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: issue.content }}
          />
        </div>
      </main>

      {/* ── Footer strip ────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-14"
        style={{ backgroundColor: "#1A1814" }}
      >
        <GrainOverlay />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: "#B07035" }}
          >
            Common Rare
          </p>
          <p
            className="text-[22px] md:text-[28px] font-black leading-tight mb-6"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              color: "#F5F0E8",
            }}
          >
            Get every issue in your inbox.
          </p>
          <Link
            href="/newsletter"
            className="inline-block rounded-sm px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Browse the archive
          </Link>
        </div>
      </section>
    </>
  );
}
