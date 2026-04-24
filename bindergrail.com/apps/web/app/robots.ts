import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/", "/auth/", "/login", "/signup", "/dashboard"],
    },
    sitemap: "https://bindergrail.com/sitemap.xml",
  };
}
