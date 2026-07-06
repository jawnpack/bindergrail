import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WB2SCKMX');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="D346lQG5GYH5qgTyOGDJ0g"
          async
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZJ892WD99N"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZJ892WD99N');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WB2SCKMX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Binder Grail",
              url: "https://bindergrail.com",
              description:
                "Practical Pokémon TCG market analysis, sealed product strategy, and honest buying advice for casual collectors.",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Binder Grail",
              url: "https://bindergrail.com",
              logo: "https://bindergrail.com/images/binder_grail_logo.png",
              email: "hello@bindergrail.com",
              sameAs: ["https://commonrare.bindergrail.com"],
            },
          ]}
        />
        {children}
      </body>
    </html>
  );
}
