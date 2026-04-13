import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsletterToggle from "./NewsletterToggle";

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

  // Fetch profile from users table (newsletter_subscribed defaults true if row missing)
  const { data: profile } = await supabase
    .from("users")
    .select("newsletter_subscribed")
    .eq("id", user.id)
    .single();

  const newsletterSubscribed = profile?.newsletter_subscribed ?? true;

  return (
    <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-[680px] mx-auto px-6">
        <h1
          className="text-[28px] font-bold mb-8"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Account
        </h1>

        {/* ── Section 1: Account details ─────────────────────── */}
        <div
          className="rounded-sm p-8 mb-5 border"
          style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#7A7468" }}
          >
            Your account
          </p>
          <p className="text-[15px] font-medium mb-1" style={{ color: "#1A1814" }}>
            {user.email}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="inline-block text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: "#E8E4DC", color: "#1A1814" }}
            >
              Free
            </span>
            {user.created_at && (
              <span className="text-[12px]" style={{ color: "#7A7468" }}>
                Member since {formatMemberSince(user.created_at)}
              </span>
            )}
          </div>
        </div>

        {/* ── Section 2: Newsletter preferences ─────────────── */}
        <div
          className="rounded-sm p-8 mb-5 border"
          style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#7A7468" }}
          >
            Newsletter preferences
          </p>
          <p
            className="text-[16px] font-bold mb-1"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
          >
            Common Rare newsletter
          </p>
          <p className="text-[13px] mb-5" style={{ color: "#7A7468" }}>
            Our free weekly on Pokémon TCG markets and buying advice.
          </p>

          <NewsletterToggle initialSubscribed={newsletterSubscribed} />

          <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "#7A7468" }}>
            Unsubscribing removes you from Common Rare emails but keeps your
            Binder Grail account active.
          </p>
        </div>

        {/* ── Section 3: Plan ───────────────────────────────── */}
        <div
          className="rounded-sm p-8 mb-5 border"
          style={{ borderColor: "#B07035", backgroundColor: "rgba(176,112,53,0.05)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#B07035" }}
          >
            Your plan
          </p>
          <h2
            className="text-[20px] font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
          >
            Free
          </h2>
          <p className="text-[14px] mb-5" style={{ color: "#7A7468" }}>
            Upgrade to Common Rare Premium for exclusive sleeper card coverage
            and market alerts.
          </p>
          {/* TODO: when Stripe is live, change href to call /api/stripe/checkout */}
          <Link
            href="/upgrade"
            className="inline-block rounded-sm px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Upgrade to premium
          </Link>
        </div>

        {/* ── Section 4: Danger zone ────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/account/delete"
            className="text-[13px] hover:underline"
            style={{ color: "#7A7468" }}
          >
            Delete account
          </Link>
        </div>

        {/* Sign out */}
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="text-[13px] hover:underline"
            style={{ color: "#7A7468" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
