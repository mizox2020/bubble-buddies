-- Add role to profiles
alter table public.profiles add column role text not null default 'user'
  check (role in ('admin', 'user'));

-- Add assigned staff user to bookings
alter table public.bookings add column assigned_user_id uuid references public.profiles(id);

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ══════════════════════════════════════
-- Updated RLS: admins get full access
-- ══════════════════════════════════════

-- Profiles: admins can see all profiles
create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update using (public.is_admin());

-- Services: admins can manage
create policy "Admins can insert services"
  on public.services for insert with check (public.is_admin());

create policy "Admins can update services"
  on public.services for update using (public.is_admin());

create policy "Admins can delete services"
  on public.services for delete using (public.is_admin());

create policy "Admins can view all services"
  on public.services for select using (public.is_admin());

-- Available Slots: admins can manage
create policy "Admins can insert slots"
  on public.available_slots for insert with check (public.is_admin());

create policy "Admins can update slots"
  on public.available_slots for update using (public.is_admin());

create policy "Admins can delete slots"
  on public.available_slots for delete using (public.is_admin());

create policy "Admins can view all slots"
  on public.available_slots for select using (public.is_admin());

-- Bookings: admins can manage all
create policy "Admins can view all bookings"
  on public.bookings for select using (public.is_admin());

create policy "Admins can insert any booking"
  on public.bookings for insert with check (public.is_admin());

create policy "Admins can update any booking"
  on public.bookings for update using (public.is_admin());

create policy "Admins can delete bookings"
  on public.bookings for delete using (public.is_admin());

-- Bookings: assigned users can view their assignments
create policy "Assigned users can view their assignments"
  on public.bookings for select using (auth.uid() = assigned_user_id);

-- Payments: admins can manage all
create policy "Admins can view all payments"
  on public.payments for select using (public.is_admin());

create policy "Admins can insert payments"
  on public.payments for insert with check (public.is_admin());

create policy "Admins can update payments"
  on public.payments for update using (public.is_admin());

-- Seed: make first user an admin (run manually or update later)
-- To promote a user to admin: update public.profiles set role = 'admin' where id = '<user-uuid>';
