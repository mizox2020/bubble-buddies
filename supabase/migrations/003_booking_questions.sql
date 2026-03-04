-- Dynamic questions that admins can configure for the booking form
create table public.booking_questions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  type text not null default 'checkbox' check (type in ('checkbox', 'text', 'select')),
  options jsonb, -- for 'select' type: ["Option A","Option B"]
  required boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.booking_questions enable row level security;

-- Everyone can read active questions (needed for booking form)
create policy "Anyone can view active questions"
  on public.booking_questions for select using (active = true);

create policy "Admins can manage questions"
  on public.booking_questions for all using (public.is_admin());

-- Store answers as JSONB on bookings: { "question_id": value, ... }
alter table public.bookings add column answers jsonb default '{}';

-- Seed some default questions
insert into public.booking_questions (label, type, required, sort_order) values
  ('Do you have water on facility?', 'checkbox', false, 1),
  ('Do you have electricity on facility?', 'checkbox', false, 2),
  ('Is the event outdoors?', 'checkbox', false, 3);
