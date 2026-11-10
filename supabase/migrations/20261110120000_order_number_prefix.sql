-- New orders are numbered ZV-100xxx (Zarvonique) instead of the old two-letter prefix.
-- Existing orders keep their numbers: customers already have them for tracking.
-- Safe to re-run.
alter table public.orders
  alter column order_number set default ('ZV-' || nextval('public.order_number_seq'));
