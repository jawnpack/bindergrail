-- Arcade admin allowlist + helper. Admin-gated RLS across the Gut Check content
-- system checks membership here instead of hardcoding UUIDs. To make yourself an
-- admin after applying: insert your auth.users id into arcade_admins.
-- REVIEW BEFORE APPLYING (not auto-run).

create table if not exists public.arcade_admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.arcade_admins enable row level security;

-- Admins can see the admin list; nobody can self-insert (manage via SQL editor
-- or a service-role action only).
drop policy if exists arcade_admins_select on public.arcade_admins;
create policy arcade_admins_select
  on public.arcade_admins for select
  using (user_id = auth.uid());

-- SECURITY DEFINER so RLS policies can call it without recursing into the table's
-- own RLS. Returns true when the current user is an admin.
create or replace function public.is_arcade_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.arcade_admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_arcade_admin() from public;
grant execute on function public.is_arcade_admin() to authenticated, anon;
