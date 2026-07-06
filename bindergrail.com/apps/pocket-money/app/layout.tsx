import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pocket Money — Pokémon TCG Budget Tracker",
    template: "%s | Pocket Money",
  },
  description:
    "Set a monthly budget, log every purchase, and track your Pokémon TCG spending. A Binder Grail tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
