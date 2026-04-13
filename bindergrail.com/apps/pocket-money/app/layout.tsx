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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
