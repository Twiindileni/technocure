-- ============================================
-- TechnoCure — Storage Buckets
-- ============================================
-- Run in Supabase SQL editor OR use Supabase dashboard to create buckets

-- Create storage buckets
insert into storage.buckets (id, name, public) values
  ('product-images',            'product-images',            true),
  ('part-images',               'part-images',               true),
  ('ticket-attachments',        'ticket-attachments',        false),
  ('part-request-attachments',  'part-request-attachments',  false),
  ('quote-attachments',         'quote-attachments',         false)
on conflict (id) do nothing;

-- Public read for product/part images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

create policy "Public read part images"
  on storage.objects for select
  using (bucket_id = 'part-images');

create policy "Admins upload part images"
  on storage.objects for insert
  with check (bucket_id = 'part-images' AND auth.role() = 'authenticated');

-- Ticket attachments: authenticated only
create policy "Authenticated users can upload ticket attachments"
  on storage.objects for insert
  with check (bucket_id = 'ticket-attachments' AND auth.role() = 'authenticated');

create policy "Users can view own ticket attachments"
  on storage.objects for select
  using (bucket_id = 'ticket-attachments' AND auth.role() = 'authenticated');
