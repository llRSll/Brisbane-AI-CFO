-- Live Event App schema
-- Run in Supabase SQL editor if tables are not already present.

create extension if not exists "pgcrypto";

create table if not exists public.attendees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  company text,
  created_at timestamptz not null default now()
);

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null default '[]'::jsonb,
  is_open boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  attendee_id uuid not null references public.attendees(id) on delete cascade,
  option_index int not null,
  created_at timestamptz not null default now(),
  unique (poll_id, attendee_id)
);

create table if not exists public.question_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  summary text,
  proposed_question text,
  count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  attendee_id uuid references public.attendees(id) on delete set null,
  group_id uuid references public.question_groups(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_time text,
  end_time text,
  speaker text,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.attendees enable row level security;
alter table public.polls enable row level security;
alter table public.votes enable row level security;
alter table public.questions enable row level security;
alter table public.question_groups enable row level security;
alter table public.schedule_items enable row level security;

drop policy if exists "read polls" on public.polls;
create policy "read polls" on public.polls for select using (true);

drop policy if exists "read votes" on public.votes;
create policy "read votes" on public.votes for select using (true);

drop policy if exists "read questions" on public.questions;
create policy "read questions" on public.questions for select using (true);

drop policy if exists "read question_groups" on public.question_groups;
create policy "read question_groups" on public.question_groups for select using (true);

drop policy if exists "read schedule_items" on public.schedule_items;
create policy "read schedule_items" on public.schedule_items for select using (true);

alter publication supabase_realtime add table public.polls;
alter publication supabase_realtime add table public.votes;
alter publication supabase_realtime add table public.questions;
alter publication supabase_realtime add table public.question_groups;
alter publication supabase_realtime add table public.schedule_items;
