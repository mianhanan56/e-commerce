-- Photo storage for products and collections, uploaded from the admin portal.
--
-- The bucket is public, so the storefront loads images straight from their public URLs and
-- needs no read policy. Only admins (public.is_admin()) can upload, replace or delete files.
-- Safe to run more than once.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog', 'catalog', true, 4194304,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins read catalog images" on storage.objects;
drop policy if exists "admins upload catalog images" on storage.objects;
drop policy if exists "admins update catalog images" on storage.objects;
drop policy if exists "admins delete catalog images" on storage.objects;

create policy "admins read catalog images" on storage.objects
  for select to authenticated
  using (bucket_id = 'catalog' and (select public.is_admin()));
create policy "admins upload catalog images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'catalog' and (select public.is_admin()));
create policy "admins update catalog images" on storage.objects
  for update to authenticated
  using (bucket_id = 'catalog' and (select public.is_admin()))
  with check (bucket_id = 'catalog' and (select public.is_admin()));
create policy "admins delete catalog images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'catalog' and (select public.is_admin()));
