import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "All Posts — Pokémon TCG Guides & Market Analysis",
  description:
    "Pokémon TCG investing and collecting guides — sealed product strategy, grading, market timing, and more.",
  alternates: { canonical: "https://bindergrail.com/blog" },
  openGraph: {
    type: "website",
    siteName: "Binder Grail",
    title: "All Posts — Pokémon TCG Guides & Market Analysis",
    description:
      "Pokémon TCG investing and collecting guides — sealed product strategy, grading, market timing, and more.",
    url: "https://bindergrail.com/blog",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Pokémon TCG guides and market analysis")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
