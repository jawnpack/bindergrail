-- Gut Check card library + image derivatives. Content is data, never hardcoded in
-- the app. Originals stay private; only derivatives are publicly readable.
-- REVIEW BEFORE APPLYING (not auto-run). Depends on 20261004000003_arcade_admins.

create table if not exists public.gut_check_cards (
  id                            uuid primary key default gen_random_uuid(),
  status                        text not null default 'draft'
                                  check (status in ('draft','review','published','retired')),
  game_eligible                 boolean not null default false,
  card_catalog_id               text,

  -- Identity
  card_name                     text not null,
  set_name                      text,
  set_code                      text,
  collector_number              text,
  release_year                  integer,
  language                      text default 'en',
  variant                       text,

  -- Grading
  grading_company               text not null default 'PSA',
  certification_number          text,
  confirmed_grade               numeric(4,1),
  cert_verified_at              timestamptz,
  cert_verification_source      text,
  grade_confidence              text not null default 'unverified'
                                  check (grade_confidence in ('confirmed_psa','verified_other','unverified')),

  -- Provenance
  source_type                   text not null default 'owned'
                                  check (source_type in ('owned','contributor','licensed','other')),
  source_notes                  text,
  contributor_id                uuid references auth.users (id) on delete set null,
  submission_id                 uuid, -- links back to gut_check_submissions (FK added in that migration)

  -- Public image URLs (derivatives). Originals live in gut_check_images / private bucket.
  front_image_url               text,
  back_image_url                text,
  full_card_image_url           text,
  front_crop_url                text,
  back_crop_url                 text,
  certificate_redacted_image_url text,

  -- Teaching content
  description_short             text,
  condition_report              text,
  front_centering_estimate      text,
  back_centering_estimate       text,
  centering_notes               text,
  corner_notes                  text,
  edge_notes                    text,
  surface_notes                 text,
  whitening_notes               text,
  print_line_notes              text,
  crease_notes                  text,
  other_defects                 text,
  teaching_points               text,
  difficulty                    text not null default 'medium'
                                  check (difficulty in ('easy','medium','hard','expert')),

  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

create index if not exists gut_check_cards_pool_idx
  on public.gut_check_cards (status, game_eligible, grading_company);
create index if not exists gut_check_cards_difficulty_idx
  on public.gut_check_cards (difficulty) where status = 'published';

-- Image derivatives kept separate so a new crop/redaction run never overwrites an
-- original. image_type says what each row is.
create table if not exists public.gut_check_images (
  id                 uuid primary key default gen_random_uuid(),
  gut_check_card_id  uuid not null references public.gut_check_cards (id) on delete cascade,
  image_type         text not null
                       check (image_type in ('original_front','original_back','front_crop',
                         'back_crop','full_slab','redacted_slab','detail_front','detail_back')),
  storage_bucket     text not null,
  storage_path       text not null,
  public_url         text,          -- set only for public derivatives
  width              integer,
  height             integer,
  crop_metadata      jsonb,
  redaction_metadata jsonb,
  created_at         timestamptz not null default now()
);

create index if not exists gut_check_images_card_idx
  on public.gut_check_images (gut_check_card_id, image_type);

-- Image types safe to expose publicly. Note: full_slab is the UNREDACTED original
-- and is intentionally excluded; the public full view is redacted_slab.
create or replace function public.gut_check_public_image_type(t text)
returns boolean language sql immutable as $$
  select t in ('front_crop','back_crop','redacted_slab','detail_front','detail_back');
$$;

alter table public.gut_check_cards enable row level security;
alter table public.gut_check_images enable row level security;

-- Cards: public reads published+eligible; admins see/do everything.
drop policy if exists gut_check_cards_public_select on public.gut_check_cards;
create policy gut_check_cards_public_select
  on public.gut_check_cards for select
  using (status = 'published' and game_eligible = true);

drop policy if exists gut_check_cards_admin_all on public.gut_check_cards;
create policy gut_check_cards_admin_all
  on public.gut_check_cards for all
  using (public.is_arcade_admin())
  with check (public.is_arcade_admin());

-- Images: public reads only safe derivatives of published cards; admins see all.
drop policy if exists gut_check_images_public_select on public.gut_check_images;
create policy gut_check_images_public_select
  on public.gut_check_images for select
  using (
    public.gut_check_public_image_type(image_type)
    and exists (
      select 1 from public.gut_check_cards c
      where c.id = gut_check_card_id and c.status = 'published' and c.game_eligible
    )
  );

drop policy if exists gut_check_images_admin_all on public.gut_check_images;
create policy gut_check_images_admin_all
  on public.gut_check_images for all
  using (public.is_arcade_admin())
  with check (public.is_arcade_admin());

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists gut_check_cards_touch on public.gut_check_cards;
create trigger gut_check_cards_touch
  before update on public.gut_check_cards
  for each row execute function public.touch_updated_at();

-- ANSWER PROTECTION: confirmed_grade (the answer) and teaching_points (the
-- explanation) must not be readable before a guess. Replace the public roles'
-- table-wide SELECT with an explicit column grant that OMITS those columns (plus
-- private provenance). Fail-closed: new columns aren't public until added here.
-- Reveals go through gut_check_reveal() (after a guess); admin tools read the full
-- row via the service-role key, which bypasses these grants.
revoke select on public.gut_check_cards from anon, authenticated;
grant select (
  id, status, game_eligible, card_catalog_id, card_name, set_name, set_code,
  collector_number, release_year, language, variant, grading_company,
  certification_number, cert_verified_at, grade_confidence, source_type,
  front_image_url, back_image_url, full_card_image_url, front_crop_url,
  back_crop_url, certificate_redacted_image_url, description_short, condition_report,
  front_centering_estimate, back_centering_estimate, centering_notes, corner_notes,
  edge_notes, surface_notes, whitening_notes, print_line_notes, crease_notes,
  other_defects, difficulty, created_at, updated_at
) on public.gut_check_cards to anon, authenticated;
