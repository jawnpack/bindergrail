"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { inputClass, successClass, errorClass } from "@/components/ui/field";
import type { Surface } from "@/components/ui/surface";

export default function SignUpForm({ surface = "ink" }: { surface?: Surface }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, utmSource: "site" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className={successClass(surface)}>
        You&apos;re in. Check your inbox for a welcome email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-measure-lead flex-col gap-3 sm:flex-row sm:gap-2">
      <label htmlFor="signup-email" className="sr-only">
        Email address
      </label>
      <input
        id="signup-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`${inputClass(surface)} sm:flex-1`}
      />
      <Button
        type="submit"
        variant={surface === "ink" || surface === "forest" ? "primary" : "primary-light"}
        disabled={status === "loading"}
        className="whitespace-nowrap"
      >
        {status === "loading" ? "Signing up…" : "Sign up — it's free"}
      </Button>
      {status === "error" && (
        <p role="alert" className={`${errorClass(surface)} w-full`}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
