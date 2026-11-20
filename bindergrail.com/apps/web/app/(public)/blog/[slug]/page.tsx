import { Children, isValidElement } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { BLOG_IMAGE_DIMENSIONS } from "@/lib/blog-images";
import Band from "@/components/ui/Band";
import SectionHeader from "@/components/ui/SectionHeader";
import PullQuote from "@/components/PullQuote";
import SignUpForm from "@/components/SignUpForm";
import CardboardFlipBanner from "@/components/CardboardFlipBanner";
import ArticleHero from "@/components/ArticleHero";
import JsonLd from "@/components/JsonLd";
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
  const ogImage = `/api/og?title=${encodeURIComponent(meta.title)}&tag=${encodeURIComponent(meta.tag)}`;
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
      modifiedTime: meta.updated ?? meta.date,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

type Kids = { children?: React.ReactNode };

// Plain text of a node, for spotting run-in heads.
function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<Kids>(node)) return textOf(node.props.children);
  return "";
}

// A run-in head is a paragraph that opens with a short bold phrase ending in
// "." or ":" ("**Phase 1: Initial release.** The first wave…"). It's set as an amber
// small-caps label over a hairline, so a run of them reads as a printed list.
function RunInStrong({ children }: Kids) {
  return (
    <strong className="mb-1 block text-label uppercase text-amber-deep">{children}</strong>
  );
}

function Strong({ children }: Kids) {
  return <strong className="font-semibold">{children}</strong>;
}

// Only short phrases qualify: a whole bold sentence set in caps would be hard
// to read, so it stays ordinary bold.
const RUN_IN_MAX = 56;

function isRunIn(children: React.ReactNode) {
  const first = Children.toArray(children)[0];
  if (!isValidElement<Kids>(first) || first.type !== Strong) return false;
  const text = textOf(first.props.children).trim();
  return /[.:]$/.test(text) && text.length <= RUN_IN_MAX;
}

// Article body: 17px / 1.7 at a ≤68ch measure, H2s at display-m with s-8 above.
const mdxComponents = {
  h2: ({ children }: Kids) => (
    <h2 className="mt-(--s-8) mb-(--s-4) font-serif text-display-m text-balance text-on-cream">
      {children}
    </h2>
  ),
  h3: ({ children }: Kids) => (
    <h3 className="mt-(--s-7) mb-(--s-3) font-serif text-display-s text-balance text-on-cream">
      {children}
    </h3>
  ),
  p: ({ children }: Kids) => {
    if (isRunIn(children)) {
      const [first, ...rest] = Children.toArray(children);
      return (
        <p className="mb-6 border-t border-cream-hairline pt-4 text-body text-pretty text-on-cream">
          {isValidElement<Kids>(first) ? (
            <RunInStrong>{textOf(first.props.children).trim().replace(/[.:]$/, "")}</RunInStrong>
          ) : null}
          {rest}
        </p>
      );
    }
    return <p className="mb-6 text-body text-pretty text-on-cream">{children}</p>;
  },
  strong: Strong,
  a: ({ href, children }: Kids & { href?: string }) => (
    <a
      href={href}
      className="text-amber-deep underline decoration-1 underline-offset-3 hover:text-on-cream"
    >
      {children}
    </a>
  ),
  ul: ({ children }: Kids) => (
    <ul className="my-6 ml-5 list-disc space-y-2 text-body marker:text-amber">{children}</ul>
  ),
  ol: ({ children }: Kids) => (
    <ol className="figures my-6 ml-5 list-decimal space-y-2 text-body marker:text-on-cream-muted">
      {children}
    </ol>
  ),
  li: ({ children }: Kids) => <li className="pl-1 text-pretty">{children}</li>,
  blockquote: ({ children }: Kids) => (
    <blockquote className="my-8 border-l-2 border-amber pl-5 italic text-on-cream-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-(--s-7) border-cream-hairline" />,
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    const dims = src ? BLOG_IMAGE_DIMENSIONS[src] : undefined;
    return (
      <span className="my-8 block overflow-hidden rounded-md border border-cream-hairline">
        {src && dims ? (
          <Image
            src={src}
            alt={alt || "Pokémon TCG blog image"}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 720px) 100vw, 672px"
            className="block h-auto w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || "Pokémon TCG blog image"}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full object-contain"
          />
        )}
      </span>
    );
  },
  PullQuote,
};

// ~230 words a minute, MDX/markdown syntax stripped first.
function readingMinutes(source: string) {
  const words = source
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const postUrl = `https://bindergrail.com/blog/${slug}`;
  const firstBodyImage = content.match(/\/images\/blog\/[\w.-]+/)?.[0];
  const articleImage = meta.image ?? firstBodyImage;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: meta.title,
      description: meta.description,
      datePublished: meta.date,
      dateModified: meta.updated ?? meta.date,
      author: { "@type": "Organization", name: "Binder Grail", url: "https://bindergrail.com" },
      publisher: {
        "@type": "Organization",
        name: "Binder Grail",
        url: "https://bindergrail.com",
        logo: {
          "@type": "ImageObject",
          url: "https://bindergrail.com/images/binder_grail_logo.png",
        },
      },
      ...(articleImage
        ? { image: `https://bindergrail.com${articleImage}` }
        : {}),
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      url: postUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bindergrail.com" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://bindergrail.com/blog" },
        { "@type": "ListItem", position: 3, name: meta.title, item: postUrl },
      ],
    },
  ];

  const longDate = (d: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(d).toLocaleDateString("en-US", opts);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="flex-1 bg-cream px-(--gutter) pt-8 pb-(--band-y-tight) md:pt-12">
        <div className="mx-auto max-w-prose">
          <Link
            href="/blog"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-meta text-on-cream-muted hover:text-on-cream"
          >
            <span aria-hidden="true">←</span> <span className="link-grow">All posts</span>
          </Link>

          <ArticleHero
            title={meta.title}
            tag={meta.tag}
            lede={meta.description}
            dateTime={meta.date}
            readingMinutes={readingMinutes(content)}
            date={
              longDate(meta.date, { month: "long", day: "numeric", year: "numeric" }) +
              (meta.updated
                ? ` · Updated ${longDate(meta.updated, { month: "long", year: "numeric" })}`
                : "")
            }
          />

          {meta.image && (
            <div className="mb-10 overflow-hidden rounded-md border border-cream-hairline">
              <Image
                src={meta.image}
                alt={meta.title}
                width={680}
                height={340}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <article className="max-w-measure [&>h2:first-child]:mt-0">
            <MDXRemote source={content} components={mdxComponents} />
          </article>

          <div className="mt-12">
            <CardboardFlipBanner />
          </div>
        </div>
      </main>

      <Band surface="ink" rhythm="tight" labelledBy="cta-title">
        <div className="mx-auto max-w-prose px-(--gutter) md:px-0">
          <SectionHeader
            id="cta-title"
            surface="ink"
            size="m"
            kicker="Binder Grail"
            title="Enjoyed this? Get the next one in your inbox."
            lead="Create a free account to unlock the full archive and stay in the loop."
          />
          <div className="mt-6">
            <SignUpForm />
          </div>
        </div>
      </Band>
    </>
  );
}
