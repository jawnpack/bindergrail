"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";

// The site header — ink on every page, /arcade included. Primary navigation at
// the ui step in full-strength cream (15:1), not dimmed. One status marker only:
// an amber dot on Arcade while it's the newest thing.
type Item = {
  label: string;
  href: string;
  external?: boolean;
  prefetch?: boolean;
  isNew?: boolean;
};

const ITEMS: Item[] = [
  { label: "Posts", href: "/blog" },
  { label: "CR Newsletter", href: "https://commonrare.bindergrail.com", external: true },
  { label: "Origins", href: "/origins" },
  { label: "Pocket Money", href: "/pocket-money" },
  // No prefetch: the arcade is its own mini-app with its own fonts, and
  // prefetching it would preload them onto every marketing page.
  { label: "Arcade", href: "/arcade", prefetch: false, isNew: true },
  { label: "About", href: "/about" },
];

function NavLink({
  item,
  current,
  onClick,
  className,
}: {
  item: Item;
  current: boolean;
  onClick?: () => void;
  className: string;
}) {
  const inner = (
    <>
      <span className={`link-grow ${current ? "is-current" : ""}`}>{item.label}</span>
      {item.isNew ? (
        <>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-bright" />
          <span className="sr-only">(new)</span>
        </>
      ) : null}
    </>
  );
  return item.external ? (
    <a href={item.href} className={className} onClick={onClick}>
      {inner}
    </a>
  ) : (
    <Link
      href={item.href}
      prefetch={item.prefetch}
      aria-current={current ? "page" : undefined}
      className={className}
      onClick={onClick}
    >
      {inner}
    </Link>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => href !== "/" && pathname.startsWith(href);

  return (
    <header className="border-b border-ink-hairline bg-ink text-on-ink">
      <div className="mx-auto flex w-full max-w-wide items-center justify-between gap-6 px-(--gutter) py-4">
        <Link href="/" className="block shrink-0" aria-label="Binder Grail home">
          <Image
            src="/images/binder_grail_logo.png"
            alt="Binder Grail"
            width={511}
            height={234}
            sizes="(min-width: 1024px) 105px, 96px"
            priority
            className="h-11 w-auto object-contain object-left opacity-92 brightness-0 invert lg:h-12"
           
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              current={!item.external && isCurrent(item.href)}
              className="inline-flex min-h-11 items-center gap-2 text-ui text-on-ink"
            />
          ))}
          <Button href="/signup" variant="primary">
            Sign up
          </Button>
        </nav>

        <button
          type="button"
          className="-mr-2.5 inline-flex size-11 flex-col items-center justify-center gap-1.5 rounded-sm lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span
            className={`block h-0.5 w-6 bg-on-ink transition-transform duration-(--dur-fast) ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-on-ink transition-opacity duration-(--dur-fast) ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-on-ink transition-transform duration-(--dur-fast) ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-ink-hairline px-(--gutter) pt-2 pb-6 lg:hidden"
        >
          <ul className="flex flex-col">
            {ITEMS.map((item) => (
              <li key={item.href} className="border-b border-ink-hairline">
                <NavLink
                  item={item}
                  current={!item.external && isCurrent(item.href)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center gap-2 text-ui text-on-ink"
                />
              </li>
            ))}
          </ul>
          <Button href="/signup" variant="primary" className="mt-5 w-full">
            Sign up free
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
