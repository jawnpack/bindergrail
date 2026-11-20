"use client";

import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FilterGroup from "@/components/ui/FilterGroup";
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

function Tag({ tag }: { tag: Issue["tag"] }) {
  const tone = tag === "Market" ? "text-amber-deep" : "text-on-cream-muted";
  return <span className={`text-label uppercase ${tone}`}>{tag}</span>;
}

function IssueCard({ issue, locked }: { issue: Issue; locked: boolean }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="figures flex w-16 shrink-0 items-center justify-center bg-ink font-serif text-display-m italic text-on-ink-muted"
      >
        {issue.number < 10 ? `0${issue.number}` : issue.number}
      </span>
      <span className="block flex-1 px-5 py-4">
        <span className="mb-2 flex items-center gap-4">
          <Tag tag={issue.tag} />
          <time className="figures text-meta text-on-cream-muted">{formatDate(issue.date)}</time>
        </span>
        <span className="block font-serif text-display-s text-balance text-on-cream">
          <span className={locked ? "" : "link-grow"}>{issue.title}</span>
        </span>
        {issue.subtitle && (
          <span className="mt-1 line-clamp-2 block max-w-measure-card text-meta text-on-cream-muted">
            {issue.subtitle}
          </span>
        )}
      </span>
    </>
  );

  if (locked) {
    return (
      <div aria-hidden="true" className="flex overflow-hidden rounded-md border border-cream-hairline bg-parchment opacity-45 blur-[2px]">
        {inner}
      </div>
    );
  }
  return (
    <Card href={`/newsletter/${issue.id}`} className="flex overflow-hidden">
      {inner}
    </Card>
  );
}

function GateCard({ lockedCount }: { lockedCount: number }) {
  return (
    <div className="rounded-md border border-amber bg-parchment p-8 text-center">
      <div className="mb-5 flex justify-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-ink text-on-ink">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="10" height="8" rx="1.5" fill="currentColor" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
      <h3 className="mb-2 font-serif text-display-s text-on-cream">
        Issues 1–{lockedCount} are free to read
      </h3>
      <p className="mx-auto mb-7 max-w-measure-lead text-meta text-on-cream-muted">
        Create a free Binder Grail account to unlock the full archive — no payment needed.
      </p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/signup" variant="primary-light">
          Create free account
        </Button>
        <Button href="/login" variant="quiet" className="text-on-cream">
          Already have an account? Sign in
        </Button>
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
      <main className="flex-1 bg-cream py-(--band-y-tight)">
        <Container width="content">
          <p className="text-ui text-on-cream-muted">No issues published yet. Check back soon.</p>
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-cream pt-10 pb-(--band-y)">
      <Container width="content">
        <FilterGroup
          options={TAGS}
          value={activeTag}
          onChange={setActiveTag}
          label="Filter issues by topic"
          className="mb-8"
        />

        <div className="flex flex-col gap-3">
          {visibleBeforeGate.map((issue) => (
            <IssueCard key={issue.id} issue={issue} locked={false} />
          ))}
          {showGate && <GateCard lockedCount={lockedIssues.length} />}
          {/* Blurred locked issues (decorative, behind the gate) */}
          {showGate &&
            lockedIssues.slice(0, 3).map((issue) => <IssueCard key={issue.id} issue={issue} locked />)}
        </div>
      </Container>
    </main>
  );
}
