"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

type Step = 1 | 2 | 3;

const CURRENCIES: { code: string; label: string }[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "JPY", label: "JPY — Japanese Yen" },
  { code: "KRW", label: "KRW — South Korean Won" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", GBP: "£", EUR: "€", JPY: "¥",
  KRW: "₩", CAD: "CA$", AUD: "A$",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "0.5px solid var(--pm-gray-border)",
  borderRadius: 8,
  fontSize: 14,
  color: "var(--pm-ink)",
  backgroundColor: "var(--pm-white)",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--pm-ink)",
  marginBottom: 6,
};

function StepDots({ current }: { current: Step }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        marginBottom: 28,
        alignItems: "center",
      }}
    >
      {([1, 2, 3] as Step[]).map((s) => (
        <div
          key={s}
          style={{
            height: 6,
            width: s === current ? 18 : 6,
            borderRadius: 99,
            backgroundColor:
              s === current ? "var(--pm-green-mid)" : "var(--pm-gray-border)",
            transition: "all 0.2s",
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("");

  async function handleStep1(e: React.FormEvent) {
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
        .upsert({ id: data.user.id, email, display_name: displayName, currency });
    }

    setLoading(false);
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "48px 24px 32px",
        backgroundColor: "var(--pm-white)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <StepDots current={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--pm-green-mid)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Step 1 of 3
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "var(--pm-ink)",
                marginBottom: 6,
              }}
            >
              Welcome, Trainer.
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--pm-gray-text)",
                lineHeight: 1.5,
                marginBottom: 28,
              }}
            >
              Create your account to start tracking your Pokémon TCG budget.
            </p>

            <form
              onSubmit={handleStep1}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label style={labelStyle}>Display name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ash Ketchum"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "var(--pm-green-mid)",
                  color: "var(--pm-white)",
                  border: "none",
                  borderRadius: 10,
                  padding: 13,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? "Creating account..." : "Continue"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 13,
                color: "var(--pm-gray-text)",
              }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                style={{ color: "var(--pm-green-dark)", fontWeight: 500 }}
              >
                Sign in
              </a>
            </p>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--pm-green-mid)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Step 2 of 3
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "var(--pm-ink)",
                marginBottom: 6,
              }}
            >
              What&apos;s your monthly hobby budget?
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--pm-gray-text)",
                lineHeight: 1.5,
                marginBottom: 28,
              }}
            >
              You can change this any time in settings.
            </p>

            <form
              onSubmit={handleStep2}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 28,
                    fontWeight: 500,
                    color: "var(--pm-gray-border)",
                    pointerEvents: "none",
                    lineHeight: 1,
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
                    backgroundColor: "var(--pm-gray-bg)",
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 10,
                    fontSize: 28,
                    fontWeight: 500,
                    color: "var(--pm-ink)",
                    padding: "16px 16px 16px 36px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: 11,
                  color: "var(--pm-gray-text)",
                  fontStyle: "italic",
                  marginTop: -8,
                }}
              >
                This is your monthly envelope — your hobby money, your rules.
              </p>

              {error && (
                <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "var(--pm-green-mid)",
                  color: "var(--pm-white)",
                  border: "none",
                  borderRadius: 10,
                  padding: 13,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? "Saving..." : "Set my budget"}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <>
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--pm-green-mid)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Step 3 of 3
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "var(--pm-ink)",
                marginBottom: 28,
              }}
            >
              Here&apos;s your Pocket Money.
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 28,
              }}
            >
              {[
                {
                  title: "Track your spend",
                  body: "Log every purchase. Know your number.",
                },
                {
                  title: "Work toward your grail",
                  body: "Set a goal. Every sale gets you closer.",
                },
                {
                  title: "Log your sales",
                  body: "Flip something? Put it back in the Bag.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  style={{
                    backgroundColor: "var(--pm-white)",
                    border: "0.5px solid var(--pm-gray-border)",
                    borderRadius: 10,
                    padding: "14px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--pm-ink)",
                      marginBottom: 3,
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--pm-gray-text)" }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              style={{
                width: "100%",
                backgroundColor: "var(--pm-green-mid)",
                color: "var(--pm-white)",
                border: "none",
                borderRadius: 10,
                padding: 13,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Let&apos;s go
            </button>
          </>
        )}
      </div>
    </div>
  );
}
