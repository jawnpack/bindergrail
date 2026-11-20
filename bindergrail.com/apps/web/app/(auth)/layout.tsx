import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteFontClass } from "../fonts";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Sign in / sign up: a quiet parchment page with the wordmark and nothing else
// to wander off to — the form is the whole job.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${siteFontClass} paper-grain flex min-h-screen flex-col bg-parchment text-on-cream`}>
      <header className="mx-auto w-full max-w-wide px-(--gutter) py-5">
        <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center" aria-label="Binder Grail home">
          <Image
            src="/images/binder_grail_logo.png"
            alt="Binder Grail"
            width={511}
            height={234}
            sizes="96px"
            priority
            className="h-11 w-auto object-contain object-left"
          />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-(--gutter) py-12">{children}</main>
    </div>
  );
}
