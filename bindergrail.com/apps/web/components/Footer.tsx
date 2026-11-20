import Link from "next/link";
import Image from "next/image";

// Four columns of real navigation (and internal links), the wordmark, one line
// of positioning, and the copyright. Ink, like the header, so every page is
// framed the same way — /arcade included. Footer links don't prefetch.
type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Read",
    links: [
      { label: "Posts", href: "/blog" },
      { label: "Common Rare", href: "https://commonrare.bindergrail.com" },
      { label: "Issue archive", href: "/newsletter" },
      { label: "Premium", href: "/upgrade" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Pocket Money", href: "/pocket-money" },
      { label: "Origins", href: "/origins" },
    ],
  },
  {
    title: "Play",
    links: [
      { label: "Arcade", href: "/arcade" },
      { label: "The Cardboard Flip", href: "/games/thecardboardflip" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About", href: "/about" },
      { label: "Sign up", href: "/signup" },
      { label: "Contact", href: "mailto:hello@bindergrail.com" },
    ],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const cls = "inline-flex min-h-11 items-center text-meta text-on-ink-muted hover:text-on-ink";
  const inner = <span className="link-grow">{link.label}</span>;
  // External, mailto and the static games (/games/*) are plain links.
  return /^(https?:|mailto:)/.test(link.href) || link.href.startsWith("/games/") ? (
    <a href={link.href} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={link.href} prefetch={false} className={cls}>
      {inner}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-hairline bg-ink text-on-ink">
      <div className="mx-auto w-full max-w-wide px-(--gutter) py-(--band-y-tight)">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" prefetch={false} className="inline-flex min-h-11 items-center" aria-label="Binder Grail home">
              <Image
                src="/images/binder_grail_logo.png"
                alt="Binder Grail"
                width={511}
            height={234}
            sizes="87px"
                className="h-10 w-auto object-contain object-left opacity-92 brightness-0 invert"
               
              />
            </Link>
            <p className="mt-5 max-w-measure-lead font-serif text-display-s text-on-ink">
              Collect <em className="text-amber-bright">smarter.</em> Spend less.
              Chase your grail.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:col-span-8"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-2 text-label uppercase text-amber-bright">{col.title}</p>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-hairline pt-6">
          <p className="text-meta text-on-ink-muted">
            © {new Date().getFullYear()} Binder Grail
          </p>
          <p className="text-meta text-on-ink-muted">
            Pokémon TCG tools and market analysis for frugal collectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
