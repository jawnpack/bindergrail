import Image from "next/image";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";

// Design previews of Origins (the app isn't live yet). Rendered once from the
// hand-built mockups to 3x PNGs in public/images/origins/, so the page carries
// pictures of the UI rather than miniature live text.
const FRAMES = [
  {
    file: "origins-preview-1.png",
    alt: "Origins on desktop: totals for cards, value and graded cards above a list of owned cards with condition and price",
    width: 870,
    height: 747,
    cls: "w-[min(36rem,85vw)]",
    sizes: "(max-width: 680px) 85vw, 576px",
  },
  {
    file: "origins-preview-2.png",
    alt: "Origins on a phone: the collection list",
    width: 330,
    height: 747,
    cls: "w-[min(13.75rem,52vw)]",
    sizes: "(max-width: 420px) 52vw, 220px",
  },
  {
    file: "origins-preview-3.png",
    alt: "Origins on a phone: adding a card",
    width: 330,
    height: 747,
    cls: "w-[min(13.75rem,52vw)]",
    sizes: "(max-width: 420px) 52vw, 220px",
  },
];

export default function OriginsScreenshotStrip() {
  return (
    <Band surface="parchment" rhythm="tight">
      <Container width="content">
        <p className="mb-5 text-label uppercase text-on-cream-muted">App preview · scroll to see more</p>
      </Container>
      {/* Scrolls inside itself; the page never scrolls sideways. */}
      <ul
        tabIndex={0}
        aria-label="Origins app previews"
        className="flex snap-x items-end gap-5 overflow-x-auto rail pb-3"
      >
        {FRAMES.map((f) => (
          <li key={f.file} className={`shrink-0 snap-start ${f.cls}`}>
            <Image
              src={`/images/origins/${f.file}`}
              alt={f.alt}
              width={f.width}
              height={f.height}
              sizes={f.sizes}
              loading="lazy"
              className="block h-auto w-full"
            />
          </li>
        ))}
      </ul>
    </Band>
  );
}
