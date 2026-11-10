-- Pocket Money: indexes on the columns the dashboard, wishlist and account pages
-- filter and sort by. Every page query is scoped by user_id; these let Postgres
-- seek straight to one user's rows (in the order the app reads them) instead of
-- scanning. All are IF NOT EXISTS, so re-running is safe and any that already
-- exist are skipped. REVIEW, then run in the Supabase SQL editor.
--
-- If pm_monthly_budgets already has a UNIQUE (user_id, year, month) constraint,
-- that constraint's index already covers the budget lookups and the first index
-- below is redundant — check with:  \d pm_monthly_budgets

-- Current-month lookup (eq user_id, year, month) and "latest budget" carry-forward
-- (eq user_id, order year desc, month desc).
create index if not exists pm_monthly_budgets_user_period_idx
  on public.pm_monthly_budgets (user_id, year desc, month desc);

-- Transaction log (eq user_id, order date desc) and month window (date >= ...).
create index if not exists pm_transactions_user_date_idx
  on public.pm_transactions (user_id, date desc);

-- Pending holds (eq user_id, eq status, order due_date).
create index if not exists pm_holds_user_status_due_idx
  on public.pm_holds (user_id, status, due_date);

-- Wishlist (eq user_id, order created_at desc; grail lookup adds status/is_grail).
create index if not exists pm_wishlist_items_user_created_idx
  on public.pm_wishlist_items (user_id, created_at desc);

-- Per-user lists ordered by creation.
create index if not exists pm_wallet_buckets_user_created_idx
  on public.pm_wallet_buckets (user_id, created_at);
create index if not exists pm_user_tags_user_created_idx
  on public.pm_user_tags (user_id, created_at);

-- Per-user lookups.
create index if not exists pm_grail_fund_user_idx
  on public.pm_grail_fund (user_id);
create index if not exists pm_user_settings_user_idx
  on public.pm_user_settings (user_id);
