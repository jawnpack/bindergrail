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
      // The Cardboard Flip: short link people may type or share.
      {
        source: "/thecardboardflipgame",
        destination: "/games/thecardboardflip",
        permanent: false,
      },
      // The arcade lobby moved from /games to /arcade.
      {
        source: "/games",
        destination: "/arcade",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // The Cardboard Flip is a static game in public/games/thecardboardflip.
      // Serve its index.html at the clean URL (its <base> tag keeps assets resolving).
      {
        source: "/games/thecardboardflip",
        destination: "/games/thecardboardflip/index.html",
      },
    ];
  },
};

export default nextConfig;
