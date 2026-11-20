"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import { inputClass, noteClass, successClass, errorClass } from "@/components/ui/field";
import type { Surface } from "@/components/ui/surface";

type Props = {
  app: "origins" | "pocket-money";
  surface?: Surface;
};

export default function WaitlistForm({ app, surface = "ink" }: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: app,
          optedIntoNewsletter: optIn,
        }),
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
        You&apos;re on the list. We&apos;ll email you at launch.
      </p>
    );
  }

  const dark = surface === "ink" || surface === "forest";
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-measure-lead flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${id}-email`}
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
            variant={dark ? "primary" : "primary-light"}
            disabled={status === "loading"}
            className="whitespace-nowrap"
          >
            {status === "loading" ? "Joining…" : "Notify me"}
          </Button>
        </div>

        <label className={`flex min-h-11 cursor-pointer items-start gap-3 select-none ${noteClass(surface)}`}>
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-amber"
          />
          <span>
            Also subscribe me to Common Rare, the free weekly Pok&eacute;mon TCG newsletter.
            Optional, unsubscribe anytime.
          </span>
        </label>
      </form>
      {status === "error" && (
        <p role="alert" className={`mt-2 ${errorClass(surface)}`}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
