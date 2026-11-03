-- WAQT initial schema: catalogue, orders, customer messages and admin access.
--
-- Access model
--   * The public site uses the publishable key only. It can read active products and
--     categories, and it writes through the security-definer functions at the bottom
--     (create_order, track_order, submit_contact, subscribe_newsletter), which validate
--     their own input and take prices from the database.
--   * The admin portal uses the signed-in user's session. Every admin table policy
--     requires public.is_admin(), i.e. a row in public.admins for auth.uid().

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.order_status as enum (
  'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'
);
create type public.payment_method as enum ('cod', 'bank');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded');
create type public.admin_role as enum ('owner', 'staff');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Normalises Pakistani mobile numbers to 03XXXXXXXXX; returns null when invalid.
create function public.normalize_pk_phone(p_phone text) returns text
language sql immutable set search_path = '' as $$
  select case
    when n ~ '^03[0-9]{9}$' then n
    when n ~ '^3[0-9]{9}$' then '0' || n
    else null
  end
  from (
    select regexp_replace(regexp_replace(coalesce(p_phone, ''), '[\s()-]', '', 'g'),
                          '^(\+92|0092|92)', '0') as n
  ) s;
$$;

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role public.admin_role not null default 'staff',
  created_at timestamptz not null default now()
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table public.categories (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  description text not null default '',
  story text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null,
  line text not null default '',
  description text not null default '',
  category text not null references public.categories (slug) on update cascade,
  price integer not null check (price >= 0),
  original_price integer check (original_price is null or original_price > price),
  stock integer not null default 0 check (stock >= 0),
  image text not null default '',
  specs jsonb not null default '{}'::jsonb,
  is_new boolean not null default false,
  bestseller boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create sequence public.order_number_seq start 100001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('WQ-' || nextval('public.order_number_seq')),
  status public.order_status not null default 'pending',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'unpaid',
  subtotal integer not null default 0 check (subtotal >= 0),
  savings integer not null default 0 check (savings >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null default 0 check (total >= 0),
  customer_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  address text not null,
  notes text,
  internal_notes text,
  courier text,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_created_idx on public.orders (created_at desc);
create index orders_phone_idx on public.orders (phone);

create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text references public.products (id) on delete set null,
  name text not null,
  line text not null default '',
  image text not null default '',
  unit_price integer not null check (unit_price >= 0),
  original_price integer,
  qty integer not null check (qty between 1 and 10)
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  type text not null check (type in ('created', 'status', 'payment', 'shipping')),
  status public.order_status,
  message text not null default '',
  actor uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_events_order_idx on public.order_events (order_id, created_at);

-- Records status, payment and shipping changes, and restocks cancelled orders.
-- Runs for every update path (admin portal, SQL editor), so history can't be skipped.
create function public.on_order_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status then
    if old.status = 'cancelled' then
      raise exception 'cancelled_order_locked'
        using hint = 'Cancelled orders cannot be reopened. Ask the customer to order again.';
    end if;

    if new.status = 'cancelled' then
      update public.products p
      set stock = p.stock + i.qty
      from public.order_items i
      where i.order_id = new.id and i.product_id = p.id;
    end if;

    insert into public.order_events (order_id, type, status, message, actor)
    values (new.id, 'status', new.status, 'Status changed to ' || new.status, auth.uid());
  end if;

  if new.payment_status is distinct from old.payment_status then
    insert into public.order_events (order_id, type, message, actor)
    values (new.id, 'payment', 'Payment marked ' || new.payment_status, auth.uid());
  end if;

  if new.courier is distinct from old.courier
     or new.tracking_number is distinct from old.tracking_number then
    insert into public.order_events (order_id, type, message, actor)
    values (
      new.id, 'shipping',
      'Shipping: ' || coalesce(nullif(new.courier, ''), 'no courier') || ' · '
        || coalesce(nullif(new.tracking_number, ''), 'no tracking number'),
      auth.uid()
    );
  end if;

  return new;
end;
$$;

create trigger orders_audit after update on public.orders
  for each row execute function public.on_order_update();

-- ---------------------------------------------------------------------------
-- Customer messages
-- ---------------------------------------------------------------------------

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null,
  order_number text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);

create table public.newsletter_subscribers (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Admins can see the admin list; membership is managed in the SQL editor.
create policy "admins read admins" on public.admins
  for select to authenticated using ((select public.is_admin()));

create policy "public reads categories" on public.categories
  for select to anon, authenticated using (true);
create policy "admins write categories" on public.categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "public reads active products" on public.products
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "admins insert products" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update products" on public.products
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete products" on public.products
  for delete to authenticated using ((select public.is_admin()));

-- Orders are created only through create_order() and are never deleted (cancel instead).
create policy "admins read orders" on public.orders
  for select to authenticated using ((select public.is_admin()));
create policy "admins update orders" on public.orders
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins read order items" on public.order_items
  for select to authenticated using ((select public.is_admin()));

create policy "admins read order events" on public.order_events
  for select to authenticated using ((select public.is_admin()));

create policy "admins read messages" on public.contact_messages
  for select to authenticated using ((select public.is_admin()));
create policy "admins update messages" on public.contact_messages
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using ((select public.is_admin()));
create policy "admins delete subscribers" on public.newsletter_subscribers
  for delete to authenticated using ((select public.is_admin()));

-- Supabase's default privileges give anon/authenticated everything on new objects.
-- Start from nothing and grant only what the policies above are meant to allow.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant select on public.admins to authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items, public.order_events to authenticated;
grant select, update on public.contact_messages to authenticated;
grant select, delete on public.newsletter_subscribers to authenticated;

-- ---------------------------------------------------------------------------
-- Public functions (called by the storefront with the publishable key)
-- ---------------------------------------------------------------------------

-- Creates an order from {product_id, qty} pairs. Prices come from public.products and
-- stock is reserved atomically; errors use stable messages the app maps to copy.
create function public.create_order(
  p_customer jsonb,
  p_payment public.payment_method,
  p_items jsonb
) returns table (order_number text, total integer)
language plpgsql security definer set search_path = '' as $$
declare
  v_name text := btrim(coalesce(p_customer ->> 'name', ''));
  v_phone text := public.normalize_pk_phone(p_customer ->> 'phone');
  v_email text := lower(btrim(coalesce(p_customer ->> 'email', '')));
  v_city text := btrim(coalesce(p_customer ->> 'city', ''));
  v_address text := btrim(coalesce(p_customer ->> 'address', ''));
  v_notes text := nullif(btrim(coalesce(p_customer ->> 'notes', '')), '');
  v_order public.orders%rowtype;
  v_product public.products%rowtype;
  v_line record;
  v_subtotal integer := 0;
  v_savings integer := 0;
begin
  if char_length(v_name) not between 2 and 100 then
    raise exception 'invalid_name';
  end if;
  if v_phone is null then
    raise exception 'invalid_phone';
  end if;
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' or char_length(v_email) > 254 then
    raise exception 'invalid_email';
  end if;
  if char_length(v_city) not between 2 and 60 then
    raise exception 'invalid_city';
  end if;
  if char_length(v_address) not between 10 and 300 then
    raise exception 'invalid_address';
  end if;
  if char_length(coalesce(v_notes, '')) > 500 then
    raise exception 'invalid_notes';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 20 then
    raise exception 'invalid_items';
  end if;

  insert into public.orders (payment_method, customer_name, phone, email, city, address, notes)
  values (p_payment, v_name, v_phone, v_email, v_city, v_address, v_notes)
  returning * into v_order;

  for v_line in
    select e ->> 'product_id' as product_id, sum((e ->> 'qty')::integer)::integer as qty
    from jsonb_array_elements(p_items) e
    group by 1
    order by 1
  loop
    if v_line.qty is null or v_line.qty not between 1 and 5 then
      raise exception 'invalid_quantity';
    end if;

    select * into v_product from public.products
    where id = v_line.product_id and active
    for update;

    if not found then
      raise exception 'product_unavailable' using detail = coalesce(v_line.product_id, '');
    end if;
    if v_product.stock < v_line.qty then
      raise exception 'out_of_stock' using detail = v_product.name;
    end if;

    update public.products set stock = stock - v_line.qty where id = v_product.id;

    insert into public.order_items
      (order_id, product_id, name, line, image, unit_price, original_price, qty)
    values
      (v_order.id, v_product.id, v_product.name, v_product.line, v_product.image,
       v_product.price, v_product.original_price, v_line.qty);

    v_subtotal := v_subtotal + v_product.price * v_line.qty;
    v_savings := v_savings
      + (coalesce(v_product.original_price, v_product.price) - v_product.price) * v_line.qty;
  end loop;

  -- Only totals change here, so the audit trigger records no event.
  update public.orders
  set subtotal = v_subtotal, savings = v_savings, total = v_subtotal
  where id = v_order.id;

  insert into public.order_events (order_id, type, status, message)
  values (v_order.id, 'created', 'pending', 'Order placed');

  return query select v_order.order_number, v_subtotal;
end;
$$;

-- Customer-facing order lookup: needs the order number plus the phone or email used.
-- Returns no address or internal fields.
create function public.track_order(p_order_number text, p_contact text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'payment_method', o.payment_method,
    'payment_status', o.payment_status,
    'subtotal', o.subtotal,
    'savings', o.savings,
    'total', o.total,
    'city', o.city,
    'courier', o.courier,
    'tracking_number', o.tracking_number,
    'created_at', o.created_at,
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_id', i.product_id, 'name', i.name, 'line', i.line, 'image', i.image,
        'unit_price', i.unit_price, 'qty', i.qty
      ) order by i.id)
      from public.order_items i where i.order_id = o.id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('status', e.status, 'created_at', e.created_at)
        order by e.created_at)
      from public.order_events e
      where e.order_id = o.id and e.status is not null
    ), '[]'::jsonb)
  )
  from public.orders o
  where o.order_number = upper(btrim(p_order_number))
    and (
      o.phone = public.normalize_pk_phone(p_contact)
      or o.email = lower(btrim(coalesce(p_contact, '')))
    );
$$;

create function public.submit_contact(
  p_name text, p_email text, p_phone text, p_topic text, p_order_number text, p_message text
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if char_length(btrim(coalesce(p_name, ''))) not between 2 and 100 then
    raise exception 'invalid_name';
  end if;
  if lower(btrim(coalesce(p_email, ''))) !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'invalid_email';
  end if;
  if char_length(btrim(coalesce(p_message, ''))) not between 10 and 3000 then
    raise exception 'invalid_message';
  end if;

  insert into public.contact_messages (name, email, phone, topic, order_number, message)
  values (
    btrim(p_name), lower(btrim(p_email)), nullif(btrim(coalesce(p_phone, '')), ''),
    left(coalesce(nullif(btrim(p_topic), ''), 'Other'), 60),
    nullif(upper(btrim(coalesce(p_order_number, ''))), ''),
    btrim(p_message)
  );
end;
$$;

create function public.subscribe_newsletter(p_email text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' or char_length(v_email) > 254 then
    raise exception 'invalid_email';
  end if;
  insert into public.newsletter_subscribers (email) values (v_email)
  on conflict (email) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin functions
-- ---------------------------------------------------------------------------

create function public.admin_dashboard() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  v_today timestamptz := date_trunc('day', now() at time zone 'Asia/Karachi') at time zone 'Asia/Karachi';
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;

  return jsonb_build_object(
    'pending', (select count(*) from public.orders where status = 'pending'),
    'to_ship', (select count(*) from public.orders where status in ('confirmed', 'packed')),
    'orders_today', (select count(*) from public.orders where created_at >= v_today),
    'revenue_7d', (
      select coalesce(sum(total), 0) from public.orders
      where status not in ('cancelled', 'returned') and created_at >= now() - interval '7 days'
    ),
    'revenue_30d', (
      select coalesce(sum(total), 0) from public.orders
      where status not in ('cancelled', 'returned') and created_at >= now() - interval '30 days'
    ),
    'orders_30d', (
      select count(*) from public.orders
      where status not in ('cancelled', 'returned') and created_at >= now() - interval '30 days'
    ),
    'unhandled_messages', (select count(*) from public.contact_messages where not handled),
    'subscribers', (select count(*) from public.newsletter_subscribers),
    'low_stock', coalesce((
      select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'stock', stock) order by stock, name)
      from public.products where active and stock <= 3
    ), '[]'::jsonb)
  );
end;
$$;

-- Postgres grants EXECUTE to PUBLIC, and Supabase to anon/authenticated, by default.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.create_order(jsonb, public.payment_method, jsonb) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
grant execute on function public.submit_contact(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;
-- anon needs is_admin() because the products read policy calls it (it returns false).
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_dashboard() to authenticated;
grant execute on function public.normalize_pk_phone(text) to anon, authenticated;
