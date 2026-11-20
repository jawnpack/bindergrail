import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getIssue } from "@/lib/beehiiv";
import Band from "@/components/ui/Band";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) return { title: "Issue Not Found" };
  return {
    title: `${issue.title} | Common Rare`,
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const issue = await getIssue(id);
  if (!issue) notFound();

  return (
    <>
      <Band surface="ink" rule={false} reveal={false} rhythm="tight">
        <div className="mx-auto max-w-prose px-(--gutter) md:px-0">
          <Link
            href="/newsletter"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-meta text-on-ink-muted hover:text-on-ink"
          >
            <span aria-hidden="true">←</span> <span className="link-grow">Archive</span>
          </Link>
          <Kicker surface="ink" className="mb-4">
            Common Rare
          </Kicker>
          <h1 className="font-serif text-display-l text-balance text-on-ink">{issue.title}</h1>
          <time
            className="figures mt-5 block text-meta text-on-ink-muted"
            dateTime={new Date(issue.date * 1000).toISOString()}
          >
            {formatDate(issue.date)}
          </time>
        </div>
      </Band>

      <main className="flex-1 bg-cream px-(--gutter) py-(--band-y-tight)">
        <article
          className="prose mx-auto max-w-measure"
          dangerouslySetInnerHTML={{ __html: issue.content }}
        />
      </main>

      <Band surface="ink" rhythm="tight">
        <div className="mx-auto max-w-prose px-(--gutter) text-center md:px-0">
          <Kicker surface="ink" className="mb-3">
            Common Rare
          </Kicker>
          <p className="mb-6 font-serif text-display-m text-on-ink">Get every issue in your inbox.</p>
          <Button href="/newsletter" variant="primary">
            Browse the archive
          </Button>
        </div>
      </Band>
    </>
  );
}
