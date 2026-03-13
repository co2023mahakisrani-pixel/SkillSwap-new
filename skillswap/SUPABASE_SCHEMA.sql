-- Enable required extension
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text,
  surname text,
  mobile text,
  dob date,
  location text,
  bio text,
  profile_picture text,
  tokens integer not null default 0,
  is_teacher boolean not null default true,
  lectures_completed integer not null default 0,
  tasks_completed integer not null default 0,
  total_hours numeric not null default 0,
  average_rating numeric not null default 0,
  total_reviews integer not null default 0,
  skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  ai_insights jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lectures
create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.profiles on delete set null,
  teacher_name text,
  title text not null,
  description text,
  full_description text,
  video_url text,
  duration integer,
  token_cost integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Videos
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid references public.profiles on delete set null,
  title text not null,
  description text,
  skill_tag text,
  level text,
  visibility text default 'public',
  tokens_required integer not null default 0,
  video_url text,
  likes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_likes (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references public.videos on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  created_at timestamptz not null default now()
);

-- Notes
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  lecture_id uuid references public.lectures on delete cascade,
  video_id uuid references public.videos on delete cascade,
  content text,
  files jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Skills
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  icon text,
  average_rating numeric not null default 0,
  total_reviews integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  skill_id uuid references public.skills on delete cascade,
  type text not null,
  proficiency_level text,
  rating numeric,
  sessions_completed integer not null default 0,
  created_at timestamptz not null default now()
);

-- Sessions
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.profiles on delete cascade,
  learner_id uuid references public.profiles on delete cascade,
  skill_id uuid references public.skills on delete set null,
  title text,
  description text,
  schedule_date timestamptz,
  duration integer,
  status text not null default 'Pending',
  rejection_reason text,
  mentor_rating numeric,
  learner_rating numeric,
  created_at timestamptz not null default now()
);

-- Reviews and ratings
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.profiles on delete cascade,
  reviewer_id uuid references public.profiles on delete set null,
  skill_id uuid references public.skills on delete set null,
  rating numeric not null,
  title text,
  comment text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.profiles on delete cascade,
  reviewer_id uuid references public.profiles on delete set null,
  user_skill_id uuid references public.user_skills on delete set null,
  rating numeric not null,
  feedback text,
  is_anonymous boolean default false,
  created_at timestamptz not null default now()
);

-- Feedback and contacts
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete set null,
  email text,
  category text,
  subject text,
  rating numeric,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete set null,
  email text,
  subject text,
  message text,
  created_at timestamptz not null default now()
);

-- Support
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  subject text,
  category text,
  priority text,
  description text,
  status text not null default 'open',
  resolution text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets on delete cascade,
  sender_id uuid references public.profiles on delete set null,
  message text,
  created_at timestamptz not null default now()
);

-- Payments and subscriptions
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  plan_id uuid references public.subscription_plans on delete set null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  plan_id uuid references public.subscription_plans on delete set null,
  amount integer not null,
  currency text not null default 'INR',
  provider text,
  status text not null default 'pending',
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.token_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  amount integer not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Progress tracking
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  lecture_id uuid references public.lectures on delete cascade,
  video_id uuid references public.videos on delete cascade,
  completion_percentage integer not null default 0,
  is_completed boolean not null default false,
  updated_at timestamptz not null default now()
);

create unique index if not exists progress_user_lecture_unique
  on public.progress (user_id, lecture_id)
  where lecture_id is not null;

create unique index if not exists progress_user_video_unique
  on public.progress (user_id, video_id)
  where video_id is not null;

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  type text not null,
  title text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Social follows
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles on delete cascade,
  following_id uuid references public.profiles on delete cascade,
  created_at timestamptz not null default now()
);

-- Bookmarks / Wishlist
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  item_type text not null,
  item_id uuid not null,
  created_at timestamptz not null default now()
);

-- Certificates
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade,
  course_id uuid,
  mentor_id uuid references public.profiles on delete set null,
  title text,
  issued_at timestamptz not null default now(),
  certificate_url text
);

-- Direct messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles on delete cascade,
  receiver_id uuid references public.profiles on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- Live notes for realtime lecture collaboration
create table if not exists public.live_notes (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid references public.lectures on delete cascade,
  author_id uuid references public.profiles on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- RPC helpers for tokens
create or replace function public.increment_tokens(user_id_input uuid, amount_input integer)
returns void language plpgsql as $$
begin
  update public.profiles
  set tokens = tokens + amount_input,
      updated_at = now()
  where id = user_id_input;
end;
$$;

create or replace function public.decrement_tokens(user_id_input uuid, amount_input integer)
returns void language plpgsql as $$
begin
  update public.profiles
  set tokens = greatest(tokens - amount_input, 0),
      updated_at = now()
  where id = user_id_input;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.lectures enable row level security;
alter table public.notes enable row level security;
alter table public.videos enable row level security;
alter table public.video_likes enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.sessions enable row level security;
alter table public.reviews enable row level security;
alter table public.ratings enable row level security;
alter table public.feedback enable row level security;
alter table public.contacts enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.token_history enable row level security;
alter table public.progress enable row level security;
alter table public.notifications enable row level security;
alter table public.follows enable row level security;
alter table public.bookmarks enable row level security;
alter table public.certificates enable row level security;
alter table public.messages enable row level security;
alter table public.live_notes enable row level security;

-- Basic policies
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users manage own rows"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Lectures viewable by everyone"
  on public.lectures for select
  using (true);

create policy "Lectures managed by teacher"
  on public.lectures for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "Videos viewable by everyone"
  on public.videos for select
  using (true);

create policy "Users manage their videos"
  on public.videos for all
  using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

create policy "Everyone can view skills"
  on public.skills for select
  using (true);

create policy "Users manage their skills"
  on public.user_skills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Sessions visible to mentor or learner"
  on public.sessions for select
  using (auth.uid() = mentor_id or auth.uid() = learner_id);

create policy "Sessions created by learner"
  on public.sessions for insert
  with check (auth.uid() = learner_id);

create policy "Sessions updated by mentor or learner"
  on public.sessions for update
  using (auth.uid() = mentor_id or auth.uid() = learner_id);

create policy "Feedback insert"
  on public.feedback for insert
  with check (true);

create policy "Feedback read"
  on public.feedback for select
  using (true);

create policy "Contacts insert"
  on public.contacts for insert
  with check (true);

create policy "Support tickets"
  on public.support_tickets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Support messages"
  on public.support_messages for all
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

create policy "Plans readable"
  on public.subscription_plans for select
  using (true);

create policy "User subscriptions"
  on public.subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "User payments"
  on public.payments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Token history"
  on public.token_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Progress"
  on public.progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Follows"
  on public.follows for all
  using (auth.uid() = follower_id)
  with check (auth.uid() = follower_id);

create policy "Bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Certificates view"
  on public.certificates for select
  using (auth.uid() = user_id);

create policy "Certificates insert"
  on public.certificates for insert
  with check (auth.uid() = user_id);

create policy "Messages view"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Messages insert"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Live notes view"
  on public.live_notes for select
  using (true);

create policy "Live notes insert"
  on public.live_notes for insert
  with check (auth.uid() = author_id);
