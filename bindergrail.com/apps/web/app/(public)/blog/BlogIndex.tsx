"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const TAGS = ["All", "Market", "Advice"];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PostTagPill({ tag }: { tag: string }) {
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

export default function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(
    () => (activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag)),
    [posts, activeTag]
  );

  return (
    <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-5xl mx-auto px-6">
        <h1
          className="text-[36px] md:text-[48px] font-black tracking-tight mb-8"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          All posts
        </h1>

        {/* Filter pills */}
        <div className="flex gap-2 mb-10 flex-wrap">
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

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <article
              key={post.slug}
              className="rounded-sm p-6 border flex flex-col"
              style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <PostTagPill tag={post.tag} />
                <time className="text-[11px]" style={{ color: "#7A7468" }}>
                  {formatDate(post.date)}
                </time>
              </div>
              <Link href={`/blog/${post.slug}`} className="group flex-1">
                <h2
                  className="text-[18px] font-bold leading-snug mb-2 group-hover:underline"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    color: "#1A1814",
                  }}
                >
                  {post.title}
                </h2>
              </Link>
              <p className="text-[13px] leading-relaxed mt-2" style={{ color: "#7A7468" }}>
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
