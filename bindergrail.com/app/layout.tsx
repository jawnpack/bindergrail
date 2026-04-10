import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binder Grail — Pokémon TCG Investing & Collecting",
  description:
    "Practical guides on Pokémon TCG investing, sealed product strategy, grading, and building a collection that holds its value.",
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
