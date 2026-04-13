import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "All Posts",
  description:
    "Pokémon TCG investing and collecting guides — sealed product strategy, grading, market timing, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
