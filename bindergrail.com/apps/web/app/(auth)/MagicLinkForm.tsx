"use client";

import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { inputClass, errorClass } from "@/components/ui/field";

// Sign in and sign up are the same magic-link form with different words.
export default function MagicLinkForm({
  title,
  intro,
  sentAction,
  footer,
}: {
  title: string;
  intro: ReactNode;
  /** Finishes "Click it to …" on the sent screen. */
  sentAction: string;
  footer?: ReactNode;
}) {
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
      <div role="status" className="w-full max-w-sm text-center">
        <h1 className="mb-3 font-serif text-display-m text-on-cream">Check your inbox</h1>
        <p className="text-ui text-pretty text-on-cream-muted">
          We sent a magic link to <strong className="font-semibold text-on-cream">{email}</strong>.
          Click it to {sentAction} — no password needed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-serif text-display-m text-on-cream">{title}</h1>
      <p className="mt-2 mb-8 text-ui text-pretty text-on-cream-muted">{intro}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="auth-email" className="sr-only">
          Email address
        </label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-invalid={status === "error" || undefined}
          aria-describedby={status === "error" ? "auth-error" : undefined}
          className={inputClass("parchment")}
        />
        {status === "error" && (
          <p id="auth-error" role="alert" className={errorClass("parchment")}>
            {errorMsg || "Something went wrong. Please try again."}
          </p>
        )}
        <Button type="submit" variant="primary-light" disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Sending…" : "Send magic link"}
        </Button>
      </form>

      {footer ? <p className="mt-6 text-meta text-on-cream-muted">{footer}</p> : null}
    </div>
  );
}
