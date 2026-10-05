-- Player achievements + a ledger-based contributor reward system. Rewards are
-- configurable events, not hardcoded. No randomized/cash prizes. REVIEW BEFORE APPLYING.

-- Player achievements (exact-guess milestones, perfect daily, etc.). Earned
-- server-side; not client-writable.
create table if not exists public.gut_check_achievements (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  achievement  text not null,     -- 'first_exact','exact_5','exact_25','exact_50','perfect_daily'
  earned_at    timestamptz not null default now(),
  unique (user_id, achievement)
);

create index if not exists gut_check_achievements_user_idx
  on public.gut_check_achievements (user_id);

-- Contributor reward ledger: an append-only record of reward-worthy events. The
-- tangible reward is admin-configurable and fulfilled out of band; nothing random.
create table if not exists public.gut_check_contributor_rewards (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  submission_id  uuid references public.gut_check_submissions (id) on delete set null,
  event          text not null,   -- 'submission_approved','submission_published','featured_card', ...
  reward_kind    text,            -- 'credit','coupon','merch','none' (admin-set)
  reward_value   text,            -- free-form (e.g. amount/SKU/code reference)
  status         text not null default 'earned'
                   check (status in ('earned','fulfilled','void')),
  notes          text,
  created_at     timestamptz not null default now(),
  fulfilled_at   timestamptz
);

create index if not exists gut_check_rewards_user_idx
  on public.gut_check_contributor_rewards (user_id, created_at desc);

alter table public.gut_check_achievements enable row level security;
alter table public.gut_check_contributor_rewards enable row level security;

-- Users read their own achievements/rewards; admins manage all. Writes are
-- admin/service-role only (earning happens server-side), so there is no public
-- insert policy — that prevents self-granting.
drop policy if exists gut_check_achievements_select_own on public.gut_check_achievements;
create policy gut_check_achievements_select_own
  on public.gut_check_achievements for select
  using (user_id = auth.uid());

drop policy if exists gut_check_achievements_admin_all on public.gut_check_achievements;
create policy gut_check_achievements_admin_all
  on public.gut_check_achievements for all
  using (public.is_arcade_admin()) with check (public.is_arcade_admin());

drop policy if exists gut_check_rewards_select_own on public.gut_check_contributor_rewards;
create policy gut_check_rewards_select_own
  on public.gut_check_contributor_rewards for select
  using (user_id = auth.uid());

drop policy if exists gut_check_rewards_admin_all on public.gut_check_contributor_rewards;
create policy gut_check_rewards_admin_all
  on public.gut_check_contributor_rewards for all
  using (public.is_arcade_admin()) with check (public.is_arcade_admin());
