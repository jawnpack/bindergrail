import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "#D8D0C0", backgroundColor: "#F5F0E8" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Binder<span style={{ color: "#B07035" }}>·</span>Grail
        </Link>
        <p className="text-xs" style={{ color: "#7A7468" }}>
          bindergrail.com · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
