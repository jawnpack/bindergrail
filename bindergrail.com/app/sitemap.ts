import { getAllPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const postEntries = posts.map((post) => ({
    url: `https://bindergrail.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://bindergrail.com", lastModified: new Date(), priority: 1.0 },
    { url: "https://bindergrail.com/blog", lastModified: new Date(), priority: 0.9 },
    { url: "https://bindergrail.com/about", lastModified: new Date(), priority: 0.6 },
    ...postEntries,
  ];
}
