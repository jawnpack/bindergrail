"use client";

import { useState } from "react";
import Link from "next/link";
import Band from "@/components/ui/Band";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Button from "@/components/ui/Button";
import { inputClass, successClass, errorClass } from "@/components/ui/field";
const FEATURES = [
  {
    title: "Full Sleeper List",
    desc: "10 undervalued cards per week with PSA pop and price vs historical high data.",
  },
  {
    title: "Premium market alerts",
    desc: "Buying windows and restock signals — delivered when timing matters.",
  },
  {
    title: "Everything in the free newsletter, plus the alpha",
    desc: "All regular Common Rare issues plus the premium layer on top.",
  },
];

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, utmSource: "premium-waitlist" }),
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
      <p role="status" className={successClass("ink")}>
        You&apos;re on the list. We&apos;ll email you when premium launches.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-measure-lead flex-col gap-3 sm:flex-row sm:gap-2">
      <label htmlFor="premium-email" className="sr-only">
        Email address
      </label>
      <input
        id="premium-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`${inputClass("ink")} sm:flex-1`}
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="whitespace-nowrap">
        {status === "loading" ? "Joining…" : "Notify me"}
      </Button>
      {status === "error" && (
        <p role="alert" className={`${errorClass("ink")} w-full`}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

export default function UpgradePage() {
  return (
    <>
      <Band surface="ink" rule={false} reveal={false} rhythm="none" className="py-(--band-y-tight) lg:py-(--band-y)">
        <Container width="content">
          <Kicker surface="ink" className="mb-4">
            Common Rare · Premium
          </Kicker>
          <h1 className="font-serif text-display-xl text-on-ink">
            Common Rare <em className="text-amber-bright">Premium</em>
          </h1>
          <p className="mt-4 font-serif text-display-s text-on-ink-muted">Coming soon</p>
          <p className="mt-4 max-w-measure-lead text-lead text-pretty text-on-ink-muted">
            Exclusive sleeper card coverage, key buying moments, and market alerts — delivered every
            week.
          </p>
          <p className="mt-10 mb-4 text-ui font-medium text-on-ink">Get notified when premium launches</p>
          <WaitlistForm />
        </Container>
      </Band>

      <Band surface="cream" labelledBy="included" className="flex-1">
        <Container width="content">
          <h2 id="included" className="mb-8 font-serif text-display-m text-on-cream">
            What&apos;s included
          </h2>
          <ol className="divide-y divide-cream-hairline border-y border-cream-hairline">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="flex items-baseline gap-5 py-6 md:gap-8">
                <span
                  aria-hidden="true"
                  className="figures w-10 shrink-0 text-right font-serif text-display-m italic text-on-cream-muted"
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="text-ui font-semibold text-on-cream">{f.title}</p>
                  <p className="mt-1 max-w-measure text-meta text-on-cream-muted">{f.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-meta text-on-cream-muted">
            Already have an account?{" "}
            <Link href="/account" className="text-on-cream underline underline-offset-3 hover:text-amber-deep">
              Go to your account
            </Link>
          </p>
        </Container>
      </Band>
    </>
  );
}
