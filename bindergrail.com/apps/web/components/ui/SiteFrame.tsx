import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver, { REVEAL_BOOT } from "@/components/ui/RevealObserver";

// The shared chrome for every marketing page: header, footer, the fixed paper
// grain, and the one-time band entrance. The boot script is inline and first so
// the hidden state is armed before any band paints (and only when JS runs).
export default function SiteFrame({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`paper-grain flex min-h-screen flex-col bg-cream text-on-cream ${className}`}>
      <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      <Nav />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <RevealObserver />
    </div>
  );
}
