import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostMeta } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — Binder Grail`,
    description: meta.description,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) notFound();

  const { default: Post } = await import(`@/content/${slug}.mdx`);

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
            className="font-bold text-xl tracking-tight"
            style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
          >
            Binder Grail
          </Link>
          <nav className="text-sm">
            <Link
              href="/blog"
              className="hover:underline"
              style={{ color: "#B07035" }}
            >
              ← All articles
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14">
        {/* Post header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#B07035" }}
            >
              {meta.tag}
            </span>
            <span style={{ color: "#DDD8CE" }}>·</span>
            <time
              className="text-xs"
              style={{ color: "#7A6E5F" }}
              dateTime={meta.date}
            >
              {formatDate(meta.date)}
            </time>
          </div>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
          >
            {meta.title}
          </h1>
        </div>

        {/* MDX content */}
        <article
          className="prose max-w-none
            prose-headings:font-bold prose-headings:text-[#2C2A22]
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-[#2C2A22] prose-p:leading-relaxed prose-p:mb-5
            prose-strong:text-[#2C2A22] prose-strong:font-semibold
            prose-li:text-[#2C2A22] prose-li:leading-relaxed
            prose-ul:my-5 prose-ol:my-5
            prose-a:text-[#B07035] prose-a:no-underline hover:prose-a:underline"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <Post />
        </article>
      </main>

      <footer
        className="border-t mt-16 py-8"
        style={{ borderColor: "#DDD8CE" }}
      >
        <div
          className="max-w-2xl mx-auto px-6 text-sm text-center"
          style={{ color: "#7A6E5F" }}
        >
          <Link
            href="/blog"
            className="hover:underline"
            style={{ color: "#B07035" }}
          >
            ← Back to all articles
          </Link>
        </div>
      </footer>
    </div>
  );
}
