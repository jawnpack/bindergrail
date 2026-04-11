import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      <header className="px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Binder<span style={{ color: "#B07035" }}>·</span>Grail
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
