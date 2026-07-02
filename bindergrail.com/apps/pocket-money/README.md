# Pocket Money

A Pokémon TCG budgeting tool — part of [Binder Grail](https://bindergrail.com).
Live at [pocketmoney.bindergrail.com](https://pocketmoney.bindergrail.com).

Set a monthly hobby budget, log every purchase/return/sale, park upcoming
costs as "holds," keep a wishlist, and save sale proceeds toward one active
**grail**.

## Stack

- Next.js (App Router) + TypeScript + Tailwind v4 (CSS variables in
  `app/globals.css`, no `tailwind.config`)
- Supabase (auth + Postgres with RLS), typed via `@bindergrail/database`
- No UI component libraries — everything hand-built
- Inter, font weights 400/500 only

## Structure

- `app/(auth)/` — login, 3-step signup, auth callback
- `app/(app)/dashboard/` — budget header (month nav + edit), grail strip,
  holds, transaction log
- `app/(app)/wishlist/` — wishlist + grail management
- `lib/pocket-money/queries.ts` — all Supabase reads
- `lib/supabase/` — browser/server clients (cookies scoped to
  `.bindergrail.com` in production for cross-tool SSO)
- `proxy.ts` — route protection for `/dashboard` and `/wishlist`

## Data model (Supabase)

`pm_monthly_budgets` · `pm_transactions` · `pm_holds` · `pm_wishlist_items`
(`is_grail`, one active at a time) · `pm_grail_fund` · `pm_user_tags`
(unused, tags are hardcoded in `lib/pocket-money/tags.ts`) · shared `users`.

Type definitions live in `packages/database/src/types.ts` — keep them in
sync with schema changes.

## Development

```bash
npm run dev
```

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
in `.env.local`.
