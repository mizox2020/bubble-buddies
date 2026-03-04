-- Replace single image_url with images array
alter table public.services drop column if exists image_url;
alter table public.services add column images jsonb not null default '[]'::jsonb;

-- Create storage bucket for service images
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- Anyone can read (public bucket)
create policy "Public read service images"
  on storage.objects for select
  using (bucket_id = 'service-images');

-- Only admins can upload/update/delete
create policy "Admins can upload service images"
  on storage.objects for insert
  with check (bucket_id = 'service-images' and public.is_admin());

create policy "Admins can update service images"
  on storage.objects for update
  using (bucket_id = 'service-images' and public.is_admin());

create policy "Admins can delete service images"
  on storage.objects for delete
  using (bucket_id = 'service-images' and public.is_admin());
