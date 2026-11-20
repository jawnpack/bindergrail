import Link from "next/link";

export default function DeleteAccountPage() {
  return (
    <main className="flex-1 bg-cream px-(--gutter) pt-(--band-y-tight) pb-(--band-y)">
      <div className="mx-auto max-w-prose">
        <h1 className="mb-4 font-serif text-display-l text-on-cream">Delete account</h1>
        <p className="mb-8 max-w-measure text-ui text-pretty text-on-cream-muted">
          Account deletion is coming soon. In the meantime, email us at{" "}
          <a
            href="mailto:hello@bindergrail.com"
            className="text-amber-deep underline underline-offset-3 hover:text-on-cream"
          >
            hello@bindergrail.com
          </a>{" "}
          and we&apos;ll take care of it promptly.
        </p>
        <Link
          href="/account"
          className="inline-flex min-h-11 items-center gap-2 text-meta text-on-cream-muted hover:text-on-cream"
        >
          <span aria-hidden="true">←</span> <span className="link-grow">Back to account</span>
        </Link>
      </div>
    </main>
  );
}
