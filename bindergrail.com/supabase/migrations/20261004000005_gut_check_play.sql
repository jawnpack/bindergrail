-- Gut Check play: frozen daily challenges, guesses, and an aggregate-only crowd
-- distribution function. REVIEW BEFORE APPLYING. Depends on _cards + _admins.

-- A day's five cards, frozen once created so later content edits never rewrite a
-- completed day. card_ids is an ordered array of gut_check_cards.id.
create table if not exists public.gut_check_daily_challenges (
  challenge_date    date primary key,
  timezone          text not null default 'America/New_York',
  seed              text not null,
  card_ids          uuid[] not null,
  challenge_version integer not null default 1,
  created_at        timestamptz not null default now()
);

-- One row per round guess. Either user_id (signed in) or anonymous_session_id.
create table if not exists public.gut_check_guesses (
  id                   uuid primary key default gen_random_uuid(),
  challenge_date       date,                -- null = practice mode
  round_index          integer,
  gut_check_card_id    uuid not null references public.gut_check_cards (id) on delete cascade,
  guessed_grade        numeric(4,1) not null,
  confidence           text check (confidence in ('low','medium','high')),
  distance             numeric(4,1) not null,
  result               text not null check (result in ('exact','close','miss')),
  user_id              uuid references auth.users (id) on delete set null,
  anonymous_session_id text,
  created_at           timestamptz not null default now()
);

create index if not exists gut_check_guesses_card_idx
  on public.gut_check_guesses (gut_check_card_id);
create index if not exists gut_check_guesses_daily_idx
  on public.gut_check_guesses (challenge_date, round_index);

alter table public.gut_check_daily_challenges enable row level security;
alter table public.gut_check_guesses enable row level security;

-- The day's puzzle is public to read; only admins (or a service-role generator)
-- write it.
drop policy if exists gut_check_daily_public_select on public.gut_check_daily_challenges;
create policy gut_check_daily_public_select
  on public.gut_check_daily_challenges for select using (true);

drop policy if exists gut_check_daily_admin_write on public.gut_check_daily_challenges;
create policy gut_check_daily_admin_write
  on public.gut_check_daily_challenges for all
  using (public.is_arcade_admin()) with check (public.is_arcade_admin());

-- Anyone may record a guess. A signed-in guess must carry that user's id; an
-- anonymous guess leaves user_id null. Raw guesses are NOT publicly selectable —
-- crowd stats come from the aggregate function below.
drop policy if exists gut_check_guesses_insert on public.gut_check_guesses;
create policy gut_check_guesses_insert
  on public.gut_check_guesses for insert
  with check (user_id is null or user_id = auth.uid());

drop policy if exists gut_check_guesses_select_own on public.gut_check_guesses;
create policy gut_check_guesses_select_own
  on public.gut_check_guesses for select
  using (user_id is not null and user_id = auth.uid());

-- Aggregate-only crowd distribution: counts per guessed grade for a card, exposed
-- without leaking individual rows. Returns nothing until min_guesses is met.
create or replace function public.gut_check_distribution(card uuid, min_guesses integer default 20)
returns table (guessed_grade numeric, n bigint)
language plpgsql security definer set search_path = public stable as $$
declare total bigint;
begin
  select count(*) into total from public.gut_check_guesses where gut_check_card_id = card;
  if total < min_guesses then return; end if;
  return query
    select g.guessed_grade, count(*)::bigint
    from public.gut_check_guesses g
    where g.gut_check_card_id = card
    group by g.guessed_grade
    order by g.guessed_grade desc;
end; $$;

revoke all on function public.gut_check_distribution(uuid, integer) from public;
grant execute on function public.gut_check_distribution(uuid, integer) to authenticated, anon;

-- Submit + reveal in one trusted step. Records the guess (computing distance and
-- result from the hidden grade) and returns the answer + teaching. Because this is
-- the only path that returns confirmed_grade/teaching_points to a player, the
-- answer can't be read before guessing.
create or replace function public.gut_check_reveal(
  p_card uuid,
  p_guess numeric,
  p_confidence text,
  p_challenge_date date,
  p_round_index integer,
  p_anon text,
  p_close_within integer default 1
)
returns table (
  confirmed_grade numeric,
  card_name text,
  set_name text,
  collector_number text,
  teaching_points text,
  distance numeric,
  result text
)
language plpgsql security definer set search_path = public as $$
declare
  v_grade numeric;
  v_dist numeric;
  v_result text;
  v_uid uuid := auth.uid();
begin
  select c.confirmed_grade into v_grade
  from public.gut_check_cards c
  where c.id = p_card and c.status = 'published' and c.game_eligible = true;

  if v_grade is null then
    raise exception 'card not available';
  end if;

  v_dist := abs(p_guess - v_grade);
  v_result := case
    when v_dist = 0 then 'exact'
    when v_dist <= p_close_within then 'close'
    else 'miss'
  end;

  insert into public.gut_check_guesses (
    challenge_date, round_index, gut_check_card_id, guessed_grade, confidence,
    distance, result, user_id, anonymous_session_id
  ) values (
    p_challenge_date, p_round_index, p_card, p_guess, p_confidence,
    v_dist, v_result, v_uid, case when v_uid is null then p_anon else null end
  );

  return query
    select v_grade, c.card_name, c.set_name, c.collector_number,
           c.teaching_points, v_dist, v_result
    from public.gut_check_cards c where c.id = p_card;
end; $$;

revoke all on function public.gut_check_reveal(uuid, numeric, text, date, integer, text, integer) from public;
grant execute on function public.gut_check_reveal(uuid, numeric, text, date, integer, text, integer) to authenticated, anon;
