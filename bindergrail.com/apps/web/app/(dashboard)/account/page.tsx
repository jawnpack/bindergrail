import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsletterToggle from "./NewsletterToggle";
import Button from "@/components/ui/Button";

function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile from users table. newsletter_subscribed reflects a real
  // Beehiiv opt-in (reconciled at login), so it defaults false when unknown.
  const { data: profile } = await supabase
    .from("users")
    .select("newsletter_subscribed")
    .eq("id", user.id)
    .single();

  const newsletterSubscribed = profile?.newsletter_subscribed ?? false;

  const card = "rounded-md border border-cream-hairline bg-parchment p-6 md:p-8";
  const quietLink =
    "inline-flex min-h-11 items-center text-meta text-on-cream-muted hover:text-on-cream";

  return (
    <main className="flex-1 bg-cream px-(--gutter) pt-(--band-y-tight) pb-(--band-y)">
      <div className="mx-auto max-w-prose">
        <h1 className="mb-8 font-serif text-display-l text-on-cream">Account</h1>

        <div className="flex flex-col gap-5">
          {/* ── Account details ─────────────────────── */}
          <section aria-labelledby="acct-you" className={card}>
            <h2 id="acct-you" className="mb-4 text-label uppercase text-on-cream-muted">
              Your account
            </h2>
            <p className="text-ui font-medium break-all text-on-cream">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-6 items-center rounded-sm border border-cream-hairline bg-cream px-2 text-label uppercase text-on-cream">
                Free
              </span>
              {user.created_at && (
                <span className="text-meta text-on-cream-muted">
                  Member since {formatMemberSince(user.created_at)}
                </span>
              )}
            </div>
          </section>

          {/* ── Newsletter preferences ─────────────── */}
          <section aria-labelledby="acct-news" className={card}>
            <h2 id="acct-news" className="mb-4 text-label uppercase text-on-cream-muted">
              Newsletter preferences
            </h2>
            <p className="font-serif text-display-s text-on-cream">Common Rare newsletter</p>
            <p className="mt-1 mb-5 text-meta text-on-cream-muted">
              Our free weekly on Pokémon TCG markets and buying advice.
            </p>
            <NewsletterToggle initialSubscribed={newsletterSubscribed} />
            <p className="mt-4 max-w-measure-card text-meta text-on-cream-muted">
              Unsubscribing removes you from Common Rare emails but keeps your Binder Grail account
              active.
            </p>
          </section>

          {/* ── Plan ───────────────────────────────── */}
          <section aria-labelledby="acct-plan" className="rounded-md border border-amber bg-parchment p-6 md:p-8">
            <p className="mb-3 text-label uppercase text-amber-deep">Your plan</p>
            <h2 id="acct-plan" className="mb-2 font-serif text-display-s text-on-cream">
              Free
            </h2>
            <p className="mb-5 max-w-measure-card text-meta text-on-cream-muted">
              Upgrade to Common Rare Premium for exclusive sleeper card coverage and market alerts.
            </p>
            <Button href="/upgrade" variant="primary-light">
              Upgrade to premium
            </Button>
          </section>
        </div>

        <div className="mt-8 flex flex-col items-start">
          <Link href="/account/delete" className={quietLink}>
            <span className="link-grow">Delete account</span>
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className={quietLink}>
              <span className="link-grow">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
