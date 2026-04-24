import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import GrainOverlay from "@/components/GrainOverlay";
import SignUpForm from "@/components/SignUpForm";
import ArticleHero from "@/components/ArticleHero";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonical ?? `https://bindergrail.com/blog/${slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

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

// MDX component overrides for brand-consistent prose
const mdxComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2
      className="text-[24px] font-bold leading-snug mt-10 mb-4"
      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3
      className="text-[20px] font-bold leading-snug mt-8 mb-3"
      style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
    >
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-[16px] leading-[1.75] mb-5" style={{ color: "#1A1814" }}>
      {children}
    </p>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold" style={{ color: "#1A1814" }}>
      {children}
    </strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em style={{ color: "#1A1814" }}>{children}</em>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a href={href} className="hover:underline" style={{ color: "#B07035" }}>
      {children}
    </a>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="my-5 ml-5 space-y-2 list-disc" style={{ color: "#1A1814" }}>
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="my-5 ml-5 space-y-2 list-decimal" style={{ color: "#1A1814" }}>
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="text-[15px] leading-[1.7]" style={{ color: "#1A1814" }}>
      {children}
    </li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote
      className="border-l-2 pl-5 my-6 italic"
      style={{ borderColor: "#B07035", color: "#7A7468" }}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10" style={{ borderColor: "#D8D0C0" }} />,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <div style={{ margin: "2rem 0", borderRadius: "8px", overflow: "hidden", border: "1px solid #D8D0C0" }}>
      <img
        src={src}
        alt={alt || "Pokémon TCG blog image"}
        style={{ width: "100%", height: "auto", display: "block", objectFit: "contain", maxHeight: "none" }}
      />
    </div>
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.description,
      datePublished: meta.date,
      author: { "@type": "Person", name: "Jon Paek" },
      publisher: { "@type": "Organization", name: "Binder Grail", url: "https://bindergrail.com" },
      url: `https://bindergrail.com/blog/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bindergrail.com" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://bindergrail.com/blog" },
        { "@type": "ListItem", position: 3, name: meta.title, item: `https://bindergrail.com/blog/${slug}` },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-[680px] mx-auto px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] mb-10 hover:underline"
            style={{ color: "#7A7468" }}
          >
            ← All posts
          </Link>

          {/* Article hero — replaces plain title */}
          <ArticleHero
            title={meta.title}
            tag={meta.tag as "Market" | "Advice" | "News"}
            date={new Date(meta.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />

          {/* Optional hero image from frontmatter */}
          {meta.image && (
            <div
              style={{
                marginBottom: "2rem",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src={meta.image}
                alt={meta.title}
                width={680}
                height={340}
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          )}

          {/* MDX body */}
          <article>
            <MDXRemote source={content} components={mdxComponents} />
          </article>
        </div>
      </main>

      {/* CTA strip */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A1814" }}
      >
        <GrainOverlay />
        <div className="relative z-10 max-w-[680px] mx-auto px-6 py-14">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: "#B07035" }}
          >
            Binder Grail
          </p>
          <h2
            className="text-[24px] font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
          >
            Enjoyed this? Get the next one in your inbox.
          </h2>
          <p className="text-[14px] mb-6" style={{ color: "#7A7468" }}>
            Create a free account to unlock the full archive and stay in the loop.
          </p>
          <SignUpForm />
        </div>
      </section>
    </>
  );
}
