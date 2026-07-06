-- Portfolio backend: projects table, admin sessions, and an image bucket.
-- Run this in the Supabase SQL editor, or via `supabase db push`.

-- ------------------------------------------------------------------
-- projects: the cards shown on the site (read publicly, written by the bot)
-- ------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  number      text,
  category    text,
  name        text not null,
  summary     text,
  image_url   text,
  tools       text[] default '{}',
  link        text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Anyone (anon key) may read projects; nobody may write with the anon key.
-- All writes go through the Telegram edge function using the service role,
-- which bypasses RLS.
drop policy if exists "projects are publicly readable" on public.projects;
create policy "projects are publicly readable"
  on public.projects for select
  using (true);

-- ------------------------------------------------------------------
-- admin_sessions: Telegram chats that have passed the passkey check
-- ------------------------------------------------------------------
create table if not exists public.admin_sessions (
  chat_id        bigint primary key,
  authorized_at  timestamptz not null default now()
);

alter table public.admin_sessions enable row level security;
-- No policies: only the service role (edge function) can touch this table.

-- ------------------------------------------------------------------
-- storage: public bucket for uploaded dashboard screenshots
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read for the bucket's objects.
drop policy if exists "project images are publicly readable" on storage.objects;
create policy "project images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'project-images');
