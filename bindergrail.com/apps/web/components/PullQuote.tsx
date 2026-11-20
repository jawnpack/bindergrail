import type { ReactNode } from "react";

// A line lifted from the article and set large. It repeats body text, so it's
// hidden from screen readers (they've already heard it).
export default function PullQuote({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-hidden="true"
      className="my-(--s-8) border-y border-cream-hairline py-(--s-6) font-serif text-display-m italic text-balance text-on-cream"
    >
      <span className="mr-1 text-amber-deep">“</span>
      {children}
      <span className="ml-1 text-amber-deep">”</span>
    </aside>
  );
}
