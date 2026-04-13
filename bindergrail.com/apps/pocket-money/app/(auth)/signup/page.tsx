"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Step = 1 | 2 | 3;

const CURRENCIES = ["USD", "GBP", "EUR", "JPY", "KRW", "CAD", "AUD"];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", GBP: "£", EUR: "€", JPY: "¥",
  KRW: "₩", CAD: "CA$", AUD: "A$",
};

function StepDots({ current }: { current: Step }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 28 }}>
      {([1, 2, 3] as Step[]).map((s) => (
        <div
          key={s}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor:
              s === current
                ? "var(--pm-green-mid)"
                : s < current
                ? "var(--pm-green-light)"
                : "var(--pm-gray-border)",
            transition: "background-color 0.2s",
          }}
        />
      ))}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Step 2 state
  const [budget, setBudget] = useState("");

  // Step 1 submit
  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { display_name: displayName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("users")
        .upsert({ id: data.user.id, email, display_name: displayName })
        .eq("id", data.user.id);
    }

    setLoading(false);
    setStep(2);
  }

  // Step 2 submit
  async function handleBudgetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!budget) return;
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const now = new Date();
      await supabase.from("pm_monthly_budgets").insert({
        user_id: user.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        budget_amount: parseFloat(budget),
        currency,
      });
    }

    setLoading(false);
    setStep(3);
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        backgroundColor: "var(--pm-gray-bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <StepDots current={step} />

        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1
                style={{ fontSize: 28, fontWeight: 500, color: "var(--pm-ink)", marginBottom: 6 }}
              >
                Welcome, Trainer.
              </h1>
              <p style={{ fontSize: 14, color: "var(--pm-gray-text)" }}>
                Create your Pocket Money account.
              </p>
            </div>
            <div style={cardStyle}>
              <form
                onSubmit={handleAccountSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Input
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ash Ketchum"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--pm-ink)",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--pm-gray-border)",
                      backgroundColor: "#fff",
                      color: "var(--pm-ink)",
                      fontSize: 15,
                      appearance: "none",
                    }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c} ({CURRENCY_SYMBOLS[c]})
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                  <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
                )}
                <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? "Creating account..." : "Continue"}
                </Button>
              </form>
            </div>
            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--pm-gray-text)" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "var(--pm-green-dark)", fontWeight: 500 }}>
                Sign in
              </a>
            </p>
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1
                style={{ fontSize: 26, fontWeight: 500, color: "var(--pm-ink)", marginBottom: 6 }}
              >
                What&apos;s your monthly hobby budget?
              </h1>
              <p style={{ fontSize: 14, color: "var(--pm-gray-text)" }}>
                You can change this any time.
              </p>
            </div>
            <div style={cardStyle}>
              <form
                onSubmit={handleBudgetSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 20,
                      color: "var(--pm-gray-text)",
                      pointerEvents: "none",
                    }}
                  >
                    {CURRENCY_SYMBOLS[currency] ?? currency}
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="200"
                    required
                    style={{
                      width: "100%",
                      padding: "18px 14px 18px 36px",
                      borderRadius: 12,
                      border: "1px solid var(--pm-gray-border)",
                      backgroundColor: "#fff",
                      fontSize: 28,
                      fontWeight: 500,
                      color: "var(--pm-ink)",
                      outline: "none",
                    }}
                  />
                </div>
                {error && (
                  <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
                )}
                <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? "Saving..." : "Set my budget"}
                </Button>
              </form>
            </div>
          </>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1
                style={{ fontSize: 26, fontWeight: 500, color: "var(--pm-ink)", marginBottom: 6 }}
              >
                Here&apos;s your Pocket Money.
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {[
                {
                  title: "Track your spend",
                  desc: "Log every purchase. Know your number.",
                },
                {
                  title: "Work toward your grail",
                  desc: "Set a goal. Every sale gets you closer.",
                },
                {
                  title: "Log your sales",
                  desc: "Flip something? Put it back in the Bag.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: "16px 18px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--pm-ink)",
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--pm-gray-text)" }}>{desc}</p>
                </div>
              ))}
            </div>

            <Button
              fullWidth
              onClick={() => router.push("/dashboard")}
              style={{ fontSize: 16 }}
            >
              Let&apos;s go
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
