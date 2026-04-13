"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
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
        }}
      >
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--pm-green-mid)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: 8,
            }}
          >
            a Binder Grail tool
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "var(--pm-ink)",
              marginBottom: 6,
            }}
          >
            Pocket Money
          </h1>
          <p style={{ fontSize: 14, color: "var(--pm-gray-text)" }}>
            Sign in to your account
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: "28px 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
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
              placeholder="••••••••"
              required
            />

            {error && (
              <p style={{ fontSize: 13, color: "var(--pm-red-mid)" }}>{error}</p>
            )}

            <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--pm-gray-text)" }}>
          No account?{" "}
          <a
            href="/signup"
            style={{ color: "var(--pm-green-dark)", fontWeight: 500 }}
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
