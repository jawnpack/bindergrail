import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go Premium — Common Rare by Binder Grail",
  description:
    "Exclusive sleeper card coverage, key buying moments, and market alerts — premium Pokémon TCG analysis delivered every week.",
  alternates: { canonical: "https://bindergrail.com/upgrade" },
  openGraph: {
    title: "Go Premium — Common Rare by Binder Grail",
    description:
      "Exclusive sleeper card coverage, key buying moments, and market alerts — premium Pokémon TCG analysis delivered every week.",
    url: "https://bindergrail.com/upgrade",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
