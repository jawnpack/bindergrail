"use server";

import { headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

// Auth runs server-side so the login/signup routes don't ship the Supabase
// browser client. The server client writes the session cookies (same pm-auth
// name/scope as everywhere else) onto the action response.

type Result = { error?: string };

export async function signInAction(
  email: string,
  password: string
): Promise<Result> {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { error: error.message } : {};
}

export async function signUpAction(input: {
  email: string;
  password: string;
  displayName: string;
  currency: string;
}): Promise<Result & { needsConfirmation?: boolean; profileError?: string }> {
  const supabase = await createServerClient();
  const h = await headers();
  const origin =
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host") ?? "pocketmoney.bindergrail.com"}`;

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { display_name: input.displayName },
    },
  });
  if (error) return { error: error.message };

  // Email confirmation enabled: no session yet, so the profile write would fail
  // against RLS. The client asks the user to confirm first.
  if (!data.session) return { needsConfirmation: true };

  if (data.user) {
    const { error: profileError } = await supabase.from("users").upsert({
      id: data.user.id,
      email: input.email,
      display_name: input.displayName,
      currency: input.currency,
    });
    if (profileError) {
      return {
        profileError: "Account created, but the profile didn't save. Try signing in.",
      };
    }
  }
  return {};
}

export async function saveFirstBudgetAction(input: {
  budget: number;
  currency: string;
  year: number;
  month: number;
}): Promise<Result & { sessionExpired?: boolean }> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sessionExpired: true };

  const { error } = await supabase.from("pm_monthly_budgets").insert({
    user_id: user.id,
    year: input.year,
    month: input.month,
    budget_amount: input.budget,
    currency: input.currency,
  });
  return error ? { error: "Couldn't save your budget. Try again." } : {};
}
