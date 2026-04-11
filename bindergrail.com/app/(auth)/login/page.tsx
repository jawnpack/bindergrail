"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="w-full max-w-sm text-center">
        <h1
          className="text-[26px] font-bold mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
        >
          Check your inbox
        </h1>
        <p className="text-[14px]" style={{ color: "#7A7468" }}>
          We sent a magic link to <strong style={{ color: "#1A1814" }}>{email}</strong>.
          Click it to sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1
        className="text-[28px] font-bold mb-2"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#1A1814" }}
      >
        Sign in
      </h1>
      <p className="text-[14px] mb-8" style={{ color: "#7A7468" }}>
        Enter your email and we&apos;ll send you a magic link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full rounded-sm px-4 py-3 text-sm outline-none border focus:border-amber-600"
          style={{
            backgroundColor: "#FDFAF5",
            color: "#1A1814",
            borderColor: "#D8D0C0",
          }}
        />
        {status === "error" && (
          <p className="text-[12px]" style={{ color: "#B07035" }}>
            {errorMsg || "Something went wrong. Please try again."}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-sm py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60"
          style={{ backgroundColor: "#1A1814", color: "#F5F0E8" }}
        >
          {status === "loading" ? "Sending…" : "Send magic link"}
        </button>
      </form>
    </div>
  );
}
