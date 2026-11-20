"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Band entrances: one observer for the whole page. Each [data-reveal] block
// rises 12px and fades in once, when 15% of it is visible (CSS in globals.css).
// Re-scans on route changes. Respects reduced motion via CSS.
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

// Inline, pre-paint: arms the hidden state only once JS is known to run, and
// reveals everything after 4s regardless — content is never stranded.
export const REVEAL_BOOT =
  "document.documentElement.classList.add('reveal-ready');" +
  "setTimeout(function(){document.querySelectorAll('[data-reveal]').forEach(function(e){e.setAttribute('data-revealed','')})},4000);";
