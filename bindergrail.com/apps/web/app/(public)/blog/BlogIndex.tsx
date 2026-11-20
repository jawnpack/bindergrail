"use client";

import { useState, useMemo, type ReactNode } from "react";
import type { PostMeta } from "@/lib/posts";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import FilterGroup from "@/components/ui/FilterGroup";

const TAGS = ["All", "Market", "Advice"] as const;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndex({ posts, banner }: { posts: PostMeta[]; banner?: ReactNode }) {
  const [activeTag, setActiveTag] = useState<(typeof TAGS)[number]>("All");

  const filtered = useMemo(
    () => (activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag)),
    [posts, activeTag]
  );

  return (
    <main className="flex-1 bg-cream pt-(--band-y-tight) pb-(--band-y)">
      <Container width="content">
        <h1 className="mb-8 font-serif text-display-l text-on-cream">All posts</h1>

        <FilterGroup
          options={TAGS}
          value={activeTag}
          onChange={setActiveTag}
          label="Filter posts by topic"
          className="mb-10"
        />

        {banner && <div className="mb-8">{banner}</div>}

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((post) => (
            <li key={post.slug}>
              <Card href={`/blog/${post.slug}`} className="flex h-full flex-col p-6">
                <span className="mb-3 flex items-center gap-4">
                  <span
                    className={`text-label uppercase ${post.tag === "Market" ? "text-amber-deep" : "text-on-cream-muted"}`}
                  >
                    {post.tag}
                  </span>
                  <time dateTime={post.date} className="figures text-meta text-on-cream-muted">
                    {formatDate(post.date)}
                  </time>
                </span>
                <h2 className="font-serif text-display-s text-balance text-on-cream">
                  <span className="link-grow">{post.title}</span>
                </h2>
                <p className="mt-3 max-w-measure-card text-meta text-pretty text-on-cream-muted">
                  {post.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
