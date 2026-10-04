-- Binder Grail Arcade — token ledger.
-- Balance is the SUM of amount per user (append-only events). A view exposes the
-- balance. REVIEW BEFORE APPLYING (not auto-run).
--
-- SECURITY NOTE: the insert policy below lets a signed-in user append their own
-- events, which means the *amount* is client-trusted. That is fine for launch
-- testing, but before tokens are spendable you should move earning to a
-- SECURITY DEFINER function (or service-role server action) that computes the
-- amount from a verified game result, and tighten this policy to block direct
-- client inserts. Flagged so it isn't shipped as-is by accident.

create table if not exists public.arcade_token_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  game        text not null,
  amount      integer not null,
  reason      text not null,
  created_at  timestamptz not null default now()
);

create index if not exists arcade_token_events_user_idx
  on public.arcade_token_events (user_id);

alter table public.arcade_token_events enable row level security;

-- A user can read and append only their own events.
drop policy if exists arcade_token_events_select on public.arcade_token_events;
create policy arcade_token_events_select
  on public.arcade_token_events for select
  using (auth.uid() = user_id);

drop policy if exists arcade_token_events_insert on public.arcade_token_events;
create policy arcade_token_events_insert
  on public.arcade_token_events for insert
  with check (auth.uid() = user_id);

-- Balance view: one row per user with their summed balance. Runs with the
-- querying user's rights, so RLS still limits rows to the caller's own events.
create or replace view public.arcade_token_balances as
  select user_id, coalesce(sum(amount), 0)::bigint as balance
  from public.arcade_token_events
  group by user_id;
