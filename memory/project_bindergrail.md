---
name: Project — bindergrail.com
description: Pokémon TCG investing/collecting content platform; full stack with Supabase auth, Beehiiv newsletter, brand design system
type: project
---

**Site:** bindergrail.com — Pokémon TCG investing and collecting blog + newsletter platform.

**Stack:**
- Next.js 16.2.3 with Turbopack (App Router, route groups)
- React 19, TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- `next-mdx-remote/rsc` for rendering MDX in Server Components
- `gray-matter` for frontmatter parsing
- `@supabase/supabase-js` + `@supabase/ssr` for auth
- `@tailwindcss/typography` for prose styles

**Key config notes:**
- Next.js 16: `middleware.ts` is deprecated — use `proxy.ts` with `export function proxy(request)`
- Turbopack: remark/rehype plugins must be serializable strings (but not needed anymore — using `next-mdx-remote`)
- Typography plugin loaded via `@plugin "@tailwindcss/typography"` in globals.css
- Google Fonts loaded via `next/font/google` (Playfair Display + DM Sans), referenced via `@theme inline` CSS vars

**Brand:**
- Ink: `#1A1814`
- Cream: `#F5F0E8`
- Amber: `#B07035`
- Dust: `#7A7468`
- Parchment: `#E8E4DC`
- Border: `#D8D0C0`
- Headings: Playfair Display (serif); Body: DM Sans (sans)
- Dark sections (hero, newsletter strip) use ink bg + GrainOverlay component

**Route structure:**
- `app/(public)/` — public pages with Nav+Footer layout
- `app/(auth)/` — auth pages (minimal layout, no nav)
- `app/(dashboard)/` — account page (Nav+Footer, auth-protected)
- `app/layout.tsx` — root (Google Fonts, metadata only)
- `proxy.ts` — Supabase session refresh + /account protection

**Content:**
- `content/blog/` — 10 MDX articles (9 originals + best-sealed-pokemon-products-to-hold)
- `making-money-from-pokemon-cards-easy-to-expert-mode.mdx` REMOVED (duplicate)
- All files have `canonical` frontmatter field

**Integrations:**
- Beehiiv newsletter: `lib/beehiiv.ts` + `app/api/subscribe/route.ts`
- Supabase: `lib/supabase/client.ts` + `lib/supabase/server.ts`
- Auth: magic link via `supabase.auth.signInWithOtp`, callback at `/auth/callback`
- `.env.local` has blank env vars with comments for user to fill in

**Pending:**
- Stripe payments (scaffolded in account page as placeholder)
- OG image (`public/og-default.png` — user needs to create this)
- Supabase project setup and env vars
- Beehiiv account setup and env vars

**Why:** Jonathan is building a Pokémon TCG content platform from scratch with no coding background; needs all code handled by Claude.
