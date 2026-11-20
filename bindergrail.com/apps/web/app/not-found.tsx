import Button from "@/components/ui/Button";
import { NOT_FOUND_FONT_CSS, NOT_FOUND_FONT_VARS } from "./not-found-fonts";

export default function NotFound() {
  return (
    <div
      className="site-fonts paper-grain flex min-h-screen flex-col items-center justify-center bg-ink px-(--gutter) text-center text-on-ink"
      style={NOT_FOUND_FONT_VARS as React.CSSProperties}
    >
      {/* Fonts for this page only — see app/not-found-fonts.ts. */}
      <style dangerouslySetInnerHTML={{ __html: NOT_FOUND_FONT_CSS }} />
      {/* Pure decoration (the h1 says it in words), so it's drawn as generated
          content rather than text: low contrast on purpose. */}
      <p
        aria-hidden="true"
        data-numeral="404"
        className="figures mb-4 font-serif text-numeral text-ink-raised before:content-[attr(data-numeral)]"
      />
      <h1 className="mb-3 font-serif text-display-m text-balance text-on-ink">
        This card&apos;s not in the binder.
      </h1>
      <p className="mx-auto mb-10 max-w-measure-lead text-ui text-pretty text-on-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/" variant="primary" prefetch={false}>
          Back to homepage
        </Button>
        <Button href="/blog" variant="secondary" prefetch={false} className="text-on-ink">
          Browse all posts
        </Button>
      </div>
    </div>
  );
}
