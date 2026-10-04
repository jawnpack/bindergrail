"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./arcade.module.css";

type Mode = "in" | "up";

// Arcade-styled account panel. Accounts live in the SAME Supabase project as
// Pocket Money, so one email + password is a single Binder Grail identity across
// the arcade, Pocket Money, and any future mobile game. Signing in is optional —
// the games are free to play without it; an account just lets us save progress
// and high scores to that identity later.
export default function ArcadeAccount() {
  const [ready, setReady] = useState(false);
  const [handle, setHandle] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Create the Supabase browser client only in the browser (never during SSR,
  // where env may be absent) — createClient() is a singleton, so calling it
  // again in the handlers returns the same instance.
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setHandle(data.user?.email ?? null);
        setReady(true);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHandle(session?.user?.email ?? null);
      setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const supabase = createClient();

    if (mode === "in") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) setError(authError.message.toUpperCase());
      setBusy(false);
      return;
    }

    // New player
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      setError(authError.message.toUpperCase());
      setBusy(false);
      return;
    }

    if (data.session && data.user) {
      // Mirror Pocket Money's provisioning so this is a real Binder Grail user
      // row, not just an auth record. Non-fatal — the account exists regardless.
      await supabase
        .from("users")
        .upsert({ id: data.user.id, email }, { onConflict: "id" });
    } else {
      // Email confirmation is on for this project — no session yet.
      setNotice("CHECK YOUR EMAIL TO CONFIRM, THEN SIGN IN.");
    }
    setBusy(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail("");
    setPassword("");
  }

  const player = handle ? handle.split("@")[0].slice(0, 14).toUpperCase() : null;

  return (
    <div className={styles.player}>
      <div className={styles.playerHead}>
        <span>{player ? `PLAYER 1 · ${player}` : "PLAYER 1"}</span>
        <span className={player ? styles.creditLive : styles.credit}>
          {player ? "1UP" : "CREDIT 0"}
        </span>
      </div>

      {!ready ? null : player ? (
        <div className={styles.playerBody}>
          <p className={styles.tagline}>
            SIGNED IN. YOUR PROGRESS TRAVELS WITH THIS ACCOUNT — ON THE WEB AND,
            SOON, ON MOBILE.
          </p>
          <p className={styles.note}>
            Same account as Pocket Money.{" "}
            <button type="button" className={styles.linkBtn} onClick={signOut}>
              SIGN OUT
            </button>
          </p>
        </div>
      ) : (
        <div className={styles.playerBody}>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.tab} ${mode === "in" ? styles.tabOn : ""}`}
              onClick={() => {
                setMode("in");
                setError("");
                setNotice("");
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={`${styles.tab} ${mode === "up" ? styles.tabOn : ""}`}
              onClick={() => {
                setMode("up");
                setError("");
                setNotice("");
              }}
            >
              NEW PLAYER
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className={styles.field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              autoComplete="email"
              required
            />
            <input
              className={styles.field}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy
                ? "···"
                : mode === "in"
                  ? "▶ INSERT COIN"
                  : "▶ START NEW GAME"}
            </button>
          </form>

          {error && <p className={styles.msg}>{error}</p>}
          {notice && <p className={`${styles.msg} ${styles.msgOk}`}>{notice}</p>}

          <p className={styles.note}>
            One Binder Grail account — works here and in Pocket Money. Playing is
            free; signing in just saves your progress.
          </p>
        </div>
      )}
    </div>
  );
}
