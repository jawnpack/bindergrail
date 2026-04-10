import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      {/* Nav */}
      <header
        className="border-b"
        style={{ borderColor: "#DDD8CE", backgroundColor: "#F5F0E8" }}
      >
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
          >
            Binder Grail
          </span>
          <nav className="text-sm">
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

      <main className="flex-1 max-w-2xl mx-auto px-6 w-full">
        {/* Hero */}
        <section className="py-20 border-b" style={{ borderColor: "#DDD8CE" }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#B07035" }}
          >
            Pokémon TCG
          </p>
          <h1
            className="text-4xl font-bold leading-tight mb-6"
            style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
          >
            Invest smarter.
            <br />
            Collect with conviction.
          </h1>
          <p
            className="text-base leading-relaxed max-w-md mb-8"
            style={{ color: "#7A6E5F" }}
          >
            Practical guides on sealed product strategy, grading, market timing,
            and building a Pokémon TCG collection that holds its value over time.
          </p>
          <Link
            href="/blog"
            className="inline-block text-sm font-semibold px-5 py-2.5 rounded-sm transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "#B07035",
              color: "#F5F0E8",
            }}
          >
            Read the articles
          </Link>
        </section>

        {/* Recent posts */}
        <section className="py-14">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: "#7A6E5F" }}
          >
            Recent
          </h2>
          <div className="flex flex-col divide-y" style={{ borderColor: "#DDD8CE" }}>
            {recentPosts.map((post) => (
              <article key={post.slug} className="py-6 first:pt-0">
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
                  <h3
                    className="text-lg font-bold leading-snug group-hover:underline"
                    style={{ fontFamily: "Georgia, serif", color: "#2C2A22" }}
                  >
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/blog"
              className="text-sm hover:underline"
              style={{ color: "#B07035" }}
            >
              View all articles →
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="border-t py-8"
        style={{ borderColor: "#DDD8CE" }}
      >
        <div
          className="max-w-2xl mx-auto px-6 text-xs text-center"
          style={{ color: "#7A6E5F" }}
        >
          © {new Date().getFullYear()} Binder Grail
        </div>
      </footer>
    </div>
  );
}
