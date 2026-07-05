#!/usr/bin/env node
// Binder Grail user stats — total users + new signups per day.
//
// Usage:   node scripts/user-stats.mjs [days]   (default: last 14 days)
//
// Needs two values, read from env or from apps/*/.env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (Supabase dashboard → Settings → API.
//                                Keep it in .env.local only — never commit it.)

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = {
  ...loadEnvFile(join(root, "apps/web/.env.local")),
  ...loadEnvFile(join(root, "apps/pocket-money/.env.local")),
  ...process.env,
};

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add them to apps/web/.env.local (service role key: Supabase → Settings → API)."
  );
  process.exit(1);
}

const days = Number(process.argv[2]) || 14;

async function fetchAllUsers() {
  const users = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${url}/auth/v1/admin/users?page=${page}&per_page=1000`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) {
      console.error(`Supabase admin API error: ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    const data = await res.json();
    const batch = data.users ?? [];
    users.push(...batch);
    if (batch.length < 1000) return users;
    page++;
  }
}

const users = await fetchAllUsers();

const byDay = {};
for (const u of users) {
  const day = (u.created_at ?? "").slice(0, 10);
  byDay[day] = (byDay[day] ?? 0) + 1;
}

console.log(`\nTotal users: ${users.length}\n`);
console.log(`New signups, last ${days} days:`);

const today = new Date();
let recent = 0;
for (let i = 0; i < days; i++) {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() - i);
  const dayKey = d.toISOString().slice(0, 10);
  const count = byDay[dayKey] ?? 0;
  recent += count;
  console.log(`  ${dayKey}  ${count > 0 ? "█".repeat(Math.min(count, 40)) + " " : ""}${count}`);
}
console.log(`\n  ${recent} new in the last ${days} days.\n`);
