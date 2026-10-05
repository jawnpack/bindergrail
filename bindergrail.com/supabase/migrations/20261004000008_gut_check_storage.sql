-- Storage buckets for Gut Check. Two buckets so originals (incl. unredacted cert
-- images) are never publicly reachable, only curated derivatives are.
-- REVIEW BEFORE APPLYING. (You can also create these in the Supabase dashboard;
-- this SQL is the reproducible version.)

-- Private: raw uploads + unredacted originals. No public access; served only via
-- short-lived signed URLs from server/admin code (service role).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gutcheck-originals', 'gutcheck-originals', false,
  26214400, -- 25 MB
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do nothing;

-- Public: game-ready derivatives (crops, redacted slab, thumbnails, detail views).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gutcheck-derivatives', 'gutcheck-derivatives', true,
  10485760, -- 10 MB
  array['image/webp','image/jpeg','image/png']
)
on conflict (id) do nothing;

-- Private bucket: only admins (or service role, which bypasses RLS) may read/write.
drop policy if exists gutcheck_originals_admin_read on storage.objects;
create policy gutcheck_originals_admin_read
  on storage.objects for select
  using (bucket_id = 'gutcheck-originals' and public.is_arcade_admin());

drop policy if exists gutcheck_originals_admin_write on storage.objects;
create policy gutcheck_originals_admin_write
  on storage.objects for insert
  with check (bucket_id = 'gutcheck-originals' and public.is_arcade_admin());

-- NOTE on community uploads: submitters are NOT admins, so their raw uploads are
-- written by a server route using the service-role key (which bypasses RLS) into
-- gutcheck-originals. Do not add a broad public-insert policy on this bucket —
-- that would let anyone write originals. Enforce per-user rate limits in the route.

-- Public bucket: world-readable; writes are admin/service-role only.
drop policy if exists gutcheck_derivatives_public_read on storage.objects;
create policy gutcheck_derivatives_public_read
  on storage.objects for select
  using (bucket_id = 'gutcheck-derivatives');

drop policy if exists gutcheck_derivatives_admin_write on storage.objects;
create policy gutcheck_derivatives_admin_write
  on storage.objects for insert
  with check (bucket_id = 'gutcheck-derivatives' and public.is_arcade_admin());
