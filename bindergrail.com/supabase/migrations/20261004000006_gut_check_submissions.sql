-- Community card submissions. Kept separate from published content; a submission
-- becomes a gut_check_cards row only on moderator approval. REVIEW BEFORE APPLYING.

create table if not exists public.gut_check_submissions (
  id                     uuid primary key default gen_random_uuid(),
  submitter_user_id      uuid references auth.users (id) on delete set null,
  status                 text not null default 'received'
                           check (status in ('received','auto_rejected','needs_review',
                             'approved','published','rejected')),

  -- Private original uploads (private bucket paths; never a public URL).
  front_original_path    text,
  back_original_path     text,
  full_image_path        text,

  -- Submitter-declared / auto-extracted metadata (never trusted as truth).
  extracted_card_name    text,
  extracted_set          text,
  extracted_number       text,
  declared_grading_company text,
  declared_cert_number   text,
  declared_grade         numeric(4,1),
  hoped_grade            numeric(4,1),   -- private unless submitter opts in
  hoped_grade_public     boolean not null default false,
  upload_notes           text,

  -- Automated intake + PSA verification results.
  auto_checks            jsonb,          -- {is_card, is_pokemon, slab_visible, blurry, ...}
  psa_verification       jsonb,          -- raw/normalized PSA lookup result
  psa_verified           boolean,

  moderation_reason      text,
  reviewer_notes         text,
  rights_confirmed       boolean not null default false,  -- submitter attested rights/permission
  created_at             timestamptz not null default now(),
  reviewed_at            timestamptz,
  reviewed_by            uuid references auth.users (id) on delete set null
);

create index if not exists gut_check_submissions_status_idx
  on public.gut_check_submissions (status, created_at desc);
create index if not exists gut_check_submissions_submitter_idx
  on public.gut_check_submissions (submitter_user_id, created_at desc);

-- Now that submissions exists, link the content table's provenance FK.
alter table public.gut_check_cards
  drop constraint if exists gut_check_cards_submission_fk;
alter table public.gut_check_cards
  add constraint gut_check_cards_submission_fk
  foreign key (submission_id) references public.gut_check_submissions (id) on delete set null;

alter table public.gut_check_submissions enable row level security;

-- A signed-in user may create a submission as themselves and read their own.
drop policy if exists gut_check_submissions_insert on public.gut_check_submissions;
create policy gut_check_submissions_insert
  on public.gut_check_submissions for insert
  with check (submitter_user_id = auth.uid() and rights_confirmed = true);

drop policy if exists gut_check_submissions_select_own on public.gut_check_submissions;
create policy gut_check_submissions_select_own
  on public.gut_check_submissions for select
  using (submitter_user_id = auth.uid());

-- Admins moderate everything.
drop policy if exists gut_check_submissions_admin_all on public.gut_check_submissions;
create policy gut_check_submissions_admin_all
  on public.gut_check_submissions for all
  using (public.is_arcade_admin()) with check (public.is_arcade_admin());
