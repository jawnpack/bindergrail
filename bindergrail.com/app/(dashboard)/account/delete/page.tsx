import Link from "next/link";

export default function DeleteAccountPage() {
  return (
    <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-[680px] mx-auto px-6">
        <h1
          className="text-[28px] font-bold mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Delete account
        </h1>
        <p className="text-[15px] mb-8" style={{ color: "#7A7468" }}>
          Account deletion is coming soon. In the meantime, email us at{" "}
          <a
            href="mailto:hello@bindergrail.com"
            className="hover:underline"
            style={{ color: "#B07035" }}
          >
            hello@bindergrail.com
          </a>{" "}
          and we&apos;ll take care of it promptly.
        </p>
        <Link
          href="/account"
          className="text-[13px] hover:underline"
          style={{ color: "#7A7468" }}
        >
          ← Back to account
        </Link>
      </div>
    </main>
  );
}
