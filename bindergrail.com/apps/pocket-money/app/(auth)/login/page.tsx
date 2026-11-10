"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction } from "../actions";

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

// Auth callback redirects here with ?error=auth when a confirmation or magic
// link fails. Reading the query string is the only request-specific part of the
// page, so it lives in this small Suspense island — the form itself stays in the
// prerendered HTML instead of waiting for JavaScript.
function AuthLinkError() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== "auth") return null;
  return (
    <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>
      That sign-in link didn&apos;t work. Try signing in with your password.
    </p>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // Once the user submits, the link-error notice is replaced by live results.
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitted(true);
    setLoading(true);

    const { error: authError } = await signInAction(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    // Hard navigation (not router.push) so the browser makes a full document
    // request carrying the session cookie just set by signInWithPassword.
    // Safari doesn't reliably send a freshly-written cookie on a soft RSC nav,
    // which bounced users back to /login.
    window.location.assign("/dashboard");
  }

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
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "var(--pm-white)",
          border: "0.5px solid var(--pm-gray-border)",
          borderRadius: 16,
          padding: "32px 24px",
        }}
      >
        {/* Wordmark */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "0.04em",
              marginBottom: 16,
            }}
          >
            <span style={{ color: "var(--pm-ink)" }}>pocket </span>
            <span style={{ color: "var(--pm-green-mid)" }}>money</span>
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "var(--pm-ink)",
            }}
          >
            Sign in to Pocket Money
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
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
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error ? (
            <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
          ) : !submitted ? (
            <Suspense fallback={null}>
              <AuthLinkError />
            </Suspense>
          ) : null}

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
            {loading ? "Signing in..." : "Sign in"}
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
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            style={{ color: "var(--pm-green-dark)", fontWeight: 500 }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
