-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Services
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes int not null default 60,
  image_url text,
  features jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.services enable row level security;

create policy "Anyone can view active services"
  on public.services for select using (active = true);

-- Available Slots
create table public.available_slots (
  id uuid default gen_random_uuid() primary key,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  is_booked boolean default false,
  created_at timestamptz default now()
);

alter table public.available_slots enable row level security;

create policy "Anyone can view unbooked slots"
  on public.available_slots for select using (is_booked = false);

create policy "Authenticated users can view all slots"
  on public.available_slots for select using (auth.role() = 'authenticated');

-- Bookings
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  service_id uuid references public.services(id) not null,
  slot_id uuid references public.available_slots(id) not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  notes text,
  event_address text,
  guest_count int default 0,
  created_at timestamptz default now()
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings for select using (auth.uid() = user_id);

create policy "Users can create own bookings"
  on public.bookings for insert with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update using (auth.uid() = user_id);

-- Payments (placeholder for Stripe integration)
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','refunded')),
  payment_method text,
  stripe_payment_id text,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

create policy "Users can view own payments"
  on public.payments for select
  using (booking_id in (select id from public.bookings where user_id = auth.uid()));

-- Mark slot as booked when a booking is created
create or replace function public.mark_slot_booked()
returns trigger as $$
begin
  update public.available_slots set is_booked = true where id = new.slot_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_booking_created
  after insert on public.bookings
  for each row execute function public.mark_slot_booked();

-- Unmark slot when booking is cancelled
create or replace function public.unmark_slot_on_cancel()
returns trigger as $$
begin
  if new.status = 'cancelled' and old.status != 'cancelled' then
    update public.available_slots set is_booked = false where id = new.slot_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_booking_cancelled
  after update on public.bookings
  for each row execute function public.unmark_slot_on_cancel();

-- Seed: sample services
insert into public.services (name, description, price, duration_minutes, features) values
  ('Mini Bubble Bash', 'Perfect for small gatherings! A fun-filled hour of bubbles and laughter for up to 15 kids.', 199.00, 60,
   '["Up to 15 kids", "1 bubble machine", "Bubble wands for all", "1 hour of fun"]'::jsonb),
  ('Bubble Bonanza', 'Our most popular package! Two hours of non-stop bubble magic with foam pit action.', 349.00, 120,
   '["Up to 30 kids", "3 bubble machines", "Foam pit included", "Bubble wands & swords", "2 hours of fun"]'::jsonb),
  ('Foam Frenzy Deluxe', 'The ultimate bubble and foam experience! Perfect for large events and celebrations.', 549.00, 180,
   '["Up to 50 kids", "5 bubble machines", "Giant foam pit", "LED bubble show", "Bubble wands & swords", "3 hours of fun", "Event coordinator"]'::jsonb),
  ('Bubble Birthday Special', 'Make their birthday unforgettable with our all-inclusive bubble birthday package!', 449.00, 150,
   '["Up to 40 kids", "4 bubble machines", "Foam pit", "Birthday decorations", "Bubble-themed party favors", "2.5 hours of fun"]'::jsonb);

-- Seed: sample available slots (next 14 days)
insert into public.available_slots (slot_date, start_time, end_time)
select
  current_date + i,
  t::time,
  (t::time + interval '2 hours')
from generate_series(1, 14) as i,
     unnest(array['09:00','11:00','13:00','15:00']) as t;
