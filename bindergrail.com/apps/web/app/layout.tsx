import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bindergrail.com"),
  title: {
    default: "Binder Grail — Pokémon TCG Market Analysis & Collecting",
    template: "%s | Binder Grail",
  },
  description:
    "Practical Pokémon TCG market analysis, sealed product strategy, and honest buying advice for casual collectors.",
  openGraph: {
    siteName: "Binder Grail",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/binder_grail_logo.png", width: 511, height: 234 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bindergrail",
  },
  alternates: {
    canonical: "https://bindergrail.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="D346lQG5GYH5qgTyOGDJ0g"
          async
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Binder Grail",
              url: "https://bindergrail.com",
              description:
                "Practical Pokémon TCG market analysis, sealed product strategy, and honest buying advice for casual collectors.",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
