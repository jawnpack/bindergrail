import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIssues } from "@/lib/beehiiv";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import NewsletterArchive from "./NewsletterArchive";

export const metadata: Metadata = {
  title: "Newsletter Archive",
  description: "Every issue of Common Rare — Pokémon TCG market analysis and buying advice for frugal collectors.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const [supabase, issues] = await Promise.all([
    createClient(),
    getIssues(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = Boolean(user);

  return (
    <>
      <Band surface="ink" rule={false} reveal={false} rhythm="tight">
        <Container width="content">
          <SectionHeader
            as="h1"
            size="xl"
            surface="ink"
            kicker="Common Rare · Issue archive"
            title={
              <>
                Every <em className="text-amber-bright">issue,</em> one place.
              </>
            }
            lead="Two issues every week — market analysis, buying advice, and restock alerts."
          />
        </Container>
      </Band>

      {/* ── Archive body ────────────────────────────────────────── */}
      <NewsletterArchive issues={issues} isLoggedIn={isLoggedIn} />
    </>
  );
}
