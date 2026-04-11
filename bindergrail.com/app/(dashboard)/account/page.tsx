import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 py-14" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-[680px] mx-auto px-6">
        <h1
          className="text-[28px] font-bold mb-8"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Account
        </h1>

        {/* Account info card */}
        <div
          className="rounded-sm p-8 mb-6 border"
          style={{ borderColor: "#D8D0C0", backgroundColor: "#FDFAF5" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: "#7A7468" }}>
            Your account
          </p>
          <p className="text-[15px] font-medium mb-1" style={{ color: "#1A1814" }}>
            {user.email}
          </p>
          <p className="text-[13px]" style={{ color: "#7A7468" }}>
            Free plan
          </p>
        </div>

        {/* Upgrade placeholder */}
        <div
          className="rounded-sm p-8 mb-8 border relative overflow-hidden"
          style={{ borderColor: "#B07035", backgroundColor: "rgba(176,112,53,0.05)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#B07035" }}
          >
            Premium — Coming soon
          </p>
          <h2
            className="text-[20px] font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
          >
            Upgrade to Premium
          </h2>
          <p className="text-[14px] mb-5" style={{ color: "#7A7468" }}>
            Access premium market analysis, early newsletter editions, and the Budget tool when it launches.
          </p>
          <button
            disabled
            className="rounded-sm px-5 py-2.5 text-sm font-semibold opacity-50 cursor-not-allowed"
            style={{ backgroundColor: "#B07035", color: "#F5F0E8" }}
          >
            Upgrade — coming soon
          </button>
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
