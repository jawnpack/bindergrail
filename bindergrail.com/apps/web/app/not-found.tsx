import Link from "next/link";
import GrainOverlay from "@/components/GrainOverlay";
import { NOT_FOUND_FONT_CSS, NOT_FOUND_FONT_VARS } from "./not-found-fonts";

export default function NotFound() {
  return (
    <div
      className={`site-fonts relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6`}
      style={
        {
          backgroundColor: "#1A1814",
          ...NOT_FOUND_FONT_VARS,
        } as React.CSSProperties
      }
    >
      {/* Fonts for this page only — see app/not-found-fonts.ts. */}
      <style dangerouslySetInnerHTML={{ __html: NOT_FOUND_FONT_CSS }} />
      <GrainOverlay />
      <div className="relative z-10">
        <p
          className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C2920" }}
        >
          404
        </p>
        <h1
          className="text-[24px] md:text-[30px] font-bold mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#F5F0E8" }}
        >
          This card&apos;s not in the binder.
        </h1>
        <p className="text-[15px] max-w-sm mx-auto mb-10" style={{ color: "#7A7468" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link prefetch={false}
            href="/"
            className="rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Back to homepage
          </Link>
          <Link prefetch={false}
            href="/blog"
            className="rounded-sm px-5 py-2.5 text-sm font-semibold border transition-colors hover:border-white/40"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "#F5F0E8" }}
          >
            Browse all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
