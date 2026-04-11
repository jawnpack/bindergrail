import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tag: string;
  canonical?: string;
};

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data } = matter(raw);
      return { slug, ...(data as Omit<PostMeta, "slug">) };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { slug, ...(data as Omit<PostMeta, "slug">) } as PostMeta, content };
}
