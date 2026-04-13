"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Issue } from "@/lib/beehiiv";

const TAGS = ["All", "Market", "Advice", "News"] as const;
const FREE_PREVIEW_COUNT = 2;

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function TagPill({ tag }: { tag: Issue["tag"] }) {
  const isMarket = tag === "Market";
  const isAdvice = tag === "Advice";
  const bg = isMarket
    ? "rgba(176,112,53,0.12)"
    : isAdvice
    ? "rgba(122,116,104,0.1)"
    : "rgba(90,120,90,0.1)";
  const color = isMarket ? "#B07035" : isAdvice ? "#7A7468" : "#5A785A";
  return (
    <span
      className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm"
      style={{ backgroundColor: bg, color }}
    >
      {tag}
    </span>
  );
}

function IssueCard({ issue, locked }: { issue: Issue; locked: boolean }) {
  const card = (
    <div
      className="flex gap-0 rounded-sm overflow-hidden border transition-shadow hover:shadow-sm"
      style={{
        borderColor: "#D8D0C0",
        opacity: locked ? 0.45 : 1,
        filter: locked ? "blur(2px)" : "none",
      }}
    >
      {/* Issue number block */}
      <div
        className="flex items-center justify-center px-4 shrink-0 select-none"
        style={{ backgroundColor: "#1A1814", minWidth: 64 }}
      >
        <span
          className="text-[28px] font-black leading-none"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#2C2920",
            fontStyle: "italic",
          }}
        >
          {issue.number < 10 ? `0${issue.number}` : issue.number}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4" style={{ backgroundColor: "#FDFAF5" }}>
        <div className="flex items-center gap-3 mb-2">
          <TagPill tag={issue.tag} />
          <time className="text-[11px]" style={{ color: "#7A7468" }}>
            {formatDate(issue.date)}
          </time>
        </div>
        <p
          className="text-[16px] font-bold leading-snug mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          {issue.title}
        </p>
        {issue.subtitle && (
          <p className="text-[12px] font-light leading-relaxed line-clamp-2" style={{ color: "#7A7468" }}>
            {issue.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (locked) return <div aria-hidden>{card}</div>;
  return (
    <Link href={`/newsletter/${issue.id}`} className="block group">
      {card}
    </Link>
  );
}

function GateCard({ lockedCount }: { lockedCount: number }) {
  return (
    <div
      className="rounded-sm border p-8 text-center"
      style={{
        borderColor: "rgba(176,112,53,0.3)",
        backgroundColor: "rgba(176,112,53,0.05)",
      }}
    >
      {/* Lock icon */}
      <div className="flex justify-center mb-5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#1A1814" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <rect x="3" y="7" width="10" height="8" rx="1.5" fill="#F5F0E8" />
            <path
              d="M5 7V5a3 3 0 0 1 6 0v2"
              stroke="#F5F0E8"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="8" cy="11" r="1" fill="#1A1814" />
          </svg>
        </div>
      </div>

      <h3
        className="text-[20px] font-bold mb-2"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
      >
        Issues 1–{lockedCount} are free to read
      </h3>
      <p className="text-[14px] max-w-sm mx-auto mb-7" style={{ color: "#7A7468" }}>
        Create a free Binder Grail account to unlock the full archive — no payment needed.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/signup"
          className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
        >
          Create free account
        </Link>
        <Link
          href="/login"
          className="rounded-sm px-5 py-2.5 text-sm transition-colors"
          style={{ color: "#7A7468" }}
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}

export default function NewsletterArchive({
  issues,
  isLoggedIn,
}: {
  issues: Issue[];
  isLoggedIn: boolean;
}) {
  const [activeTag, setActiveTag] = useState<(typeof TAGS)[number]>("All");

  const filtered = useMemo(
    () => (activeTag === "All" ? issues : issues.filter((i) => i.tag === activeTag)),
    [issues, activeTag]
  );

  const showGate = !isLoggedIn && filtered.length > FREE_PREVIEW_COUNT;
  const visibleBeforeGate = isLoggedIn ? filtered : filtered.slice(0, FREE_PREVIEW_COUNT);
  const lockedIssues = isLoggedIn ? [] : filtered.slice(FREE_PREVIEW_COUNT);

  if (issues.length === 0) {
    return (
      <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[15px]" style={{ color: "#7A7468" }}>
            No issues published yet. Check back soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-12" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Filter pills */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-sm transition-colors"
              style={{
                backgroundColor: activeTag === t ? "#1A1814" : "#E8E4DC",
                color: activeTag === t ? "#F5F0E8" : "#7A7468",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Issue list */}
        <div className="flex flex-col gap-3">
          {/* Free preview issues */}
          {visibleBeforeGate.map((issue) => (
            <IssueCard key={issue.id} issue={issue} locked={false} />
          ))}

          {/* Gate card */}
          {showGate && <GateCard lockedCount={lockedIssues.length} />}

          {/* Blurred locked issues (decorative, behind gate) */}
          {showGate &&
            lockedIssues.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} locked />
            ))}
        </div>
      </div>
    </main>
  );
}
