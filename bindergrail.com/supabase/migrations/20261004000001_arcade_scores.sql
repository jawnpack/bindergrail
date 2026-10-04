-- Binder Grail Arcade — leaderboard scores.
-- One row per score. Daily games set puzzle_number; endless/arcade games leave it
-- null and may have many rows per user. REVIEW BEFORE APPLYING (not auto-run).

create table if not exists public.arcade_scores (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  game           text not null,
  puzzle_number  integer,
  score          integer not null,
  meta           jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

-- One score per user per daily puzzle (upsert target). Endless games (null
-- puzzle_number) are not constrained, so a partial unique index is used.
create unique index if not exists arcade_scores_daily_unique
  on public.arcade_scores (user_id, game, puzzle_number)
  where puzzle_number is not null;

create index if not exists arcade_scores_game_puzzle_idx
  on public.arcade_scores (game, puzzle_number, score desc);

alter table public.arcade_scores enable row level security;

-- Leaderboards are public to read.
drop policy if exists arcade_scores_select on public.arcade_scores;
create policy arcade_scores_select
  on public.arcade_scores for select
  using (true);

-- A user may only write their own rows.
drop policy if exists arcade_scores_insert on public.arcade_scores;
create policy arcade_scores_insert
  on public.arcade_scores for insert
  with check (auth.uid() = user_id);

drop policy if exists arcade_scores_update on public.arcade_scores;
create policy arcade_scores_update
  on public.arcade_scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
