import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — Binder Grail",
  description:
    "Pokémon TCG investing and collecting guides — sealed product strategy, grading, market timing, and more.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      {/* Nav */}
      <header
        className="border-b"
        style={{ borderColor: "#DDD8CE", backgroundColor: "#F5F0E8" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight"
            style={{ color: "#2C2A22", fontFamily: "Georgia, serif" }}
          >
            Binder Grail
          </Link>
          <nav className="text-sm" style={{ color: "#7A6E5F" }}>
            <Link
              href="/blog"
              className="hover:underline"
              style={{ color: "#B07035" }}
            >
              Articles
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1
          className="text-3xl font-bold mb-10"
          style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
        >
          Articles
        </h1>

        <div className="flex flex-col divide-y" style={{ borderColor: "#DDD8CE" }}>
          {posts.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#B07035" }}
                >
                  {post.tag}
                </span>
                <span style={{ color: "#DDD8CE" }}>·</span>
                <time
                  className="text-xs"
                  style={{ color: "#7A6E5F" }}
                  dateTime={post.date}
                >
                  {formatDate(post.date)}
                </time>
              </div>
              <Link href={`/blog/${post.slug}`} className="group">
                <h2
                  className="text-xl font-bold mb-2 leading-snug group-hover:underline"
                  style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
                >
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm leading-relaxed" style={{ color: "#7A6E5F" }}>
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
