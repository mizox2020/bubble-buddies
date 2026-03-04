-- Track if user has seen the welcome onboarding
alter table public.profiles add column if not exists welcome_seen_at timestamptz;
