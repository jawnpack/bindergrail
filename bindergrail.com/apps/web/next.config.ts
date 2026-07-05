import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Consolidated posts (July 2026): older overlapping guides merged
      // into their newer, more comprehensive versions.
      {
        source: "/blog/making-money-from-pokemon-cards-easy-to-expert-mode",
        destination: "/blog/how-to-make-money-with-pokemon-cards",
        permanent: true,
      },
      {
        source: "/blog/what-to-buy-to-make-money-from-pokemon-cards",
        destination: "/blog/best-sealed-pokemon-products-to-hold",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
