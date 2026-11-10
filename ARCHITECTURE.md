# Architecture — Zarvonique Men's Watches

_Last updated: 2026-11-10 (Zarvonique logo component)_

## Overview

Zarvonique is a men's watch storefront for Pakistan plus an **admin portal at `/admin`**, in one
Next.js App Router app. The backend is **Supabase** (Postgres + Auth): orders, contact messages
and newsletter sign-ups are stored there, and admins manage them in the portal. The storefront
catalogue (products + collections) is also read from Supabase and edited in the admin portal;
`data/catalog.ts` only holds types, pure helpers and a sample catalogue used when Supabase isn't
configured. Cart and wishlist stay client state in `localStorage`.

**Status (2026-11-02): backend code is written but no Supabase project exists yet.** Until
`.env.local` has the Supabase URL + publishable key, store actions return a friendly "not
connected yet" error and `/admin/*` redirects to a login page that explains setup. See
`supabase/README.md`.

## Stack

| Concern    | Choice                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| Framework  | Next.js **16.4.3** (App Router), React **19.3.0**                              |
| Language   | TypeScript 5 (strict), path alias `@/*` → repo root                            |
| Styling    | Sass (`sass` ^1.107) CSS Modules + one global `app/globals.scss`               |
| Fonts      | `next/font/google`: Cormorant Garamond (`--font-serif`), Jost (`--font-sans`)  |
| Lint       | ESLint 9 flat config: `eslint-config-next` core-web-vitals + typescript        |
| Formatting | Prettier, `printWidth: 100`                                                    |
| Backend    | Supabase: `@supabase/supabase-js`, `@supabase/ssr` (cookie sessions)           |
| Tests      | None in the repo (SQL was verified in a scratch PGlite harness, not committed) |

### Next.js 16 specifics (read before writing code)

This Next.js version differs from older training data. The docs ship in
`node_modules/next/dist/docs/`; read the relevant guide there before changing routing,
caching or data APIs (see `AGENTS.md`).

- `next.config.ts` turns on `cacheComponents: true` and `partialPrefetching: true`. Routes are
  prerendered, and dynamic parts stream inside `<Suspense>` (Partial Prerendering).
- Any client component that calls `useSearchParams()` must sit under a `<Suspense>` boundary.
  For example, `app/shop/page.tsx` wraps `ShopView` and supplies an unfiltered fallback grid.
- `params` is a Promise: `const { id } = await params`.
- Page and layout props use the global generated types `PageProps<"/route/[x]">` and
  `LayoutProps<"/">`.
- Dynamic routes prerender their known slugs with `generateStaticParams()` and set per-page
  metadata with `generateMetadata()`.

## Folder structure

```
proxy.ts                  (Next 16 "middleware") refreshes the Supabase session on /admin/*,
                          redirects signed-out visitors to /admin/login
app/
  layout.tsx              <html>/<body>, fonts, base metadata ONLY (no store chrome)
  globals.scss            Reset, base typography, body.isLocked
  favicon.ico icon.svg apple-icon.png   Zarvonique "Z" dial (Next file-convention icons)
  not-found.tsx           404, wrapped in <StoreShell>
  (store)/                Route group — URLs unchanged
    layout.tsx            <StoreShell>: CartProvider + AnnouncementBar/Header/<main>/Footer
    page.tsx              Homepage (composes components/home/*)
    shop/                 /shop: Suspense around client ShopView (URL-driven filters)
    products/[id]/        Product detail + related products (+ loading.tsx)
    cart/ checkout/ wishlist/ track-order/ about/ contact/
    help/[slug]/          shipping, returns, warranty, size-guide, faq, privacy, terms
  admin/
    layout.tsx            Admin root: noindex metadata, `export const instant = false`
    login/                Sign-in (redirects to /admin if already an admin)
    (portal)/             Guarded group: layout calls requireAdmin() and renders AdminShell
      page.tsx            Dashboard (admin_dashboard() stats, recent orders, low stock)
      orders/ orders/[id]/ List (status tabs, search, paging) and detail (status, payment,
                          shipping, notes, timeline, print)
      products/           List + new/ + [id]/ editor (add, edit, hide, delete, photo upload)
      collections/        List + new/ + [slug]/ editor (add, edit, delete when empty)
      messages/           Contact inbox with handled toggle
      subscribers/        List + export/route.ts (CSV, 401 without admin)
supabase/
  migrations/             SQL schema, RLS, functions (see "Backend")
  migrations/…_catalog_images.sql  Public "catalog" storage bucket, admin-only writes
  seed.sql                Launch categories + 15 products (same as the sample catalogue)
  README.md               Step-by-step project setup (create, migrate, admin user, env)
components/
  ui/                     Primitives: Button, Icon (inline SVG set), Reveal, SectionHeading,
                          PageHeader (+Breadcrumbs), Container, EmptyState, PageLoading,
                          Form.module.scss, Dropdown (new, uncommitted)
  layout/                 AnnouncementBar, Header (nav, mobile drawer, search, bag), Footer,
                          Logo (SVG lockup, inline/stacked, light/dark) + logo-paths.ts (generated)
  home/                   One component per homepage section
  cart/                   CartContext (cart + wishlist + drawer state), CartDrawer, CartView,
                          CartLineItem, OrderSummary, WishlistView
  admin/                  AdminShell/AdminNav, Admin.module.scss (shared admin UI kit, import
                          as `ui`), AdminPageHeader, StatusBadge/PaymentBadge, LoginForm,
                          dashboard/ orders/ products/ messages/ feature components
  product/                ProductCard, ProductGrid, ProductDetail
  shop/ search/ checkout/ track/ about/ contact/ help/   Feature components
data/
  catalog.ts              Product/Category/Catalog types, pure helpers (search, related,
                          formatPKR, ordinal…), sampleProducts/sampleCategories (offline only)
  help.ts                 Help centre / policy pages and FAQs as typed blocks
lib/
  persisted.ts            createPersistedStore / usePersisted / useHydrated
  useBodyLock.ts          Ref-counted scroll lock + Escape handler for overlays
  orders.ts               Shared order domain: statuses/labels, COURIERS, CITIES,
                          validateCheckout, friendlyDbError, formatPhone, whatsappLink,
                          formatDate/formatDateTime (Asia/Karachi)
  actions/store.ts        "use server": placeOrder, trackOrder, submitContact, subscribeNewsletter
  actions/admin.ts        "use server": signIn, signOut, updateOrder, setMessageHandled
  admin/auth.ts           getAdmin (cached per request) / requireAdmin
  supabase/env.ts         URL + publishable key, isSupabaseConfigured()
  supabase/server.ts      createSessionClient() — cookie session, for admin (RLS as the user)
  supabase/public.ts      createPublicClient() — anonymous, for storefront actions
  supabase/database.types.ts  `Database` type (hand-written; replace with generated)
  supabase/types.ts       App-facing names derived from Database + TrackedOrder/DashboardStats
styles/_tokens.scss       Design tokens and mixins
public/images/            Unsplash placeholder photos (c-* categories, p-* products, etc.)
```

## Routes

| Route                                 | Rendering                      | Notes                                                          |
| ------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `/`                                   | Static                         | Hero, Benefits, FeaturedWatches (first 8 watches), WhyChooseUs |
| `/shop`                               | Static shell + client filters  | `?category=`, `?q=`, `?sort=`, `?filter=new\|sale\|bestseller` |
| `/collections`, `/collections/[slug]` | 307 redirect (next.config.ts)  | → `/shop`, `/shop?category=<slug>` (pages removed 2026-11-10)  |
| `/products/[id]`                      | Static / PPR                   | Ids from `getCatalog()`; new ids render on demand (ISR)        |
| `/cart`, `/wishlist`                  | Static shell, client state     | Reads `localStorage` after hydration                           |
| `/checkout`                           | Static shell, client state     | Submits via `placeOrder` server action → `create_order`        |
| `/track-order`                        | Static shell                   | `trackOrder` action → `track_order` (number + phone/email)     |
| `/about`, `/contact`                  | Static                         | Contact form → `submitContact` → `submit_contact`              |
| `/admin/login`                        | Request time                   | Supabase email/password; must have a row in `admins`           |
| `/admin/*` (portal)                   | Request time (`instant=false`) | Guarded by proxy.ts + `requireAdmin()` + RLS                   |
| `/help/[slug]`                        | Static / PPR                   | Content from `data/help.ts`                                    |

## Data model (`data/catalog.ts` types, rows from Supabase)

```ts
type CategorySlug = string; // collections are managed in the admin
type Product = {
  id;
  name;
  line;
  image;
  price /* PKR */;
  originalPrice?;
  category: CategorySlug;
  description;
  specs: { movement; caseSize; caseMaterial; strap; glass; waterResistance };
  isNew?;
  bestseller?;
  stock?; // undefined = unknown (sample catalogue); 0 = "Sold out", add-to-bag disabled
};
type Category = { slug; name; description; story; image };
type Catalog = { products: Product[]; categories: Category[] };
```

**Where the catalogue comes from:**

- `lib/catalog.ts` (server-only): `getCatalog()` is `'use cache'` + `cacheTag("catalog")` +
  `cacheLife("hours")`. It reads active products (RLS hides inactive ones from anon) and all
  categories ordered by `sort_order, name`, maps rows to `Product`/`Category` (`toProduct`), and
  throws on a real DB error (one with a code, e.g. PGRST205) rather than caching an empty shop.
  If Supabase can't be reached at all (supabase-js returns an error with no `code`: DNS, network,
  paused project), it logs a `console.warn`, returns the sample catalogue and caches that for only
  `cacheLife("minutes")`, so the real catalogue comes back within about a minute of Supabase
  recovering. (Added 2026-11-10 after the project host went NXDOMAIN and every page returned 500.)
  Without env vars it returns the sample catalogue. `getProduct(id)` / `getCategory(slug)` wrap it.
- Server pages/sections (shop fallback, collections, product page, home Categories /
  SignatureCollection) call `getCatalog()`. `StoreShell` (async) fetches it once and provides it
  to client components through `CatalogProvider` / `useCatalog()`
  (`components/catalog/CatalogContext.tsx`): cart, wishlist, search dialog, `ShopView`.
  `Footer` gets `categories` as a prop.
- Invalidation: admin catalogue actions `updateTag("catalog")` (read-your-own-writes);
  `placeOrder` and cancelling an order `revalidateTag("catalog", "max")` (stock changed).
  Edits made directly in the Supabase Table Editor appear within the hour.
- `generateStaticParams` for products/collections comes from the catalogue and returns a
  `"none"` placeholder when empty (Cache Components requires ≥ 1 param).

Pure helpers (take the arrays): `productsInCategory`, `relatedProducts`, `searchProducts`
(substring over name/line/category/movement/strap), `isSoldOut`, `formatPKR` (`Rs 38,500`),
`discountPercent`, `ordinal` (`01`, `02`…). Copy that used to hard-code counts ("Fifteen
pieces", "Five ways…") is now count-free.

Orders live in Supabase (see "Backend"). Order numbers are `ZV-100001`, `ZV-100002`… (migration `20261110120000_order_number_prefix.sql`; orders before it keep the old prefix) from a
database sequence.

## State management

- `lib/persisted.ts`: `createPersistedStore(key, initial)` is a module-level store backed by
  `localStorage`. `usePersisted` reads it through `useSyncExternalStore`, so SSR and hydration
  see `initial` and the stored value loads only on the client. Writes sync across tabs through
  the `storage` event.
- `useHydrated()` returns false during SSR and hydration. Use it to avoid flashing empty-cart UI.
- Store keys: `zarvonique:cart` (`{id, qty}[]`), `zarvonique:wishlist` (`string[]`). Keys under
  the old brand prefix are obsolete; nothing reads them.
- `CartProvider` (in `StoreShell`, used by `app/(store)/layout.tsx`) derives `items`, `count`,
  `subtotal` and `savings` from the catalogue. Quantity is clamped to 1…`MAX_QTY` (5). Cart
  drawer open/close is plain React state.
- Access the cart/wishlist only through `useCart()` (throws outside its provider).

## Styling conventions

- Every component has a co-located `Name.module.scss` that starts with
  `@use "../../styles/tokens" as *;` (a relative path, not `@/`).
- Tokens: ink `#0d0d0c`, paper `#f7f4ee`, gold `#b8996a` / `$gold-light` / `$gold-deep`,
  `$sale`. The type scale uses `clamp()`. Spacing is `$space-1`…`$space-10` on a 4px base.
  Also `$section-y`, `$gutter`, `$container` (1360px).
- Layout is mobile first: `@include up(sm|md|lg|xl|xxl)` (480/768/1024/1280/1440).
  `@include hover` guards hover styles. Other mixins: `container`, `eyebrow`, `visually-hidden`.
- Class composition: `[a, cond && b, className].filter(Boolean).join(" ")`.
- Images: above-the-fold `next/image` gets `loading="eager"` (hero/LCP also `fetchPriority="high"`;
  `priority` is deprecated in Next 16). `ProductGrid eager={n}` makes the first n cards eager
  (shop: 4, collection page: all). A `fill` image's parent must be `relative|absolute|fixed` —
  sticky is rejected, so `ProductDetail` wraps the image in an absolute `.frame`.

- Header (2026-11-10): black (`$brand-black`, the logo artwork's background) with the full
  stacked logo in the artwork's gold (`$brand-gold*` tokens). Nav links are light, active/hover
  gold. Heights: `$header-h` 5.25rem, `$header-h-lg` 6.5rem, `$header-h-xl` 7.25rem; sticky
  sidebars (cart, checkout, help) and the home/about heroes use these tokens. Four nav links
  (Home, Shop, About Us, Contact) show inline from `lg`; below that the drawer is used.
- Logo: `<Logo />` sizes from `--logo-height` set by the parent (header 4–6rem stacked, drawer
  4rem stacked, footer 10.5rem stacked, login 9rem stacked, admin sidebar 1.875rem inline).
  `surface="dark"` is the artwork's gold; `light` is a deeper gold for cream/white. Gradient ids
  come from `useId()` because several logos render on one page.
- Collections have no store pages: `collectionHref(slug)` in `data/catalog.ts` returns
  `/shop?category=<slug>`, used by footer, home Categories, search, product breadcrumb/eyebrow
  and the admin "View" links. Collections are still managed in `/admin/collections`.

## Coding conventions

- Named exports for components (`export function Header()`). Default exports only for route
  files.
- Mark client components with `"use client"` and keep them to interactive leaves. Pages stay
  server components.
- Comments are sparse: one or two lines that explain _why_, placed above the function.
- Accessibility is a priority: ARIA listbox/dialog patterns, `aria-invalid` and
  `aria-describedby` on form errors, focus management, Escape to close overlays
  (`useBodyLock`).
- Checkout validation: Pakistani mobile regex, email, city required, address ≥10 characters.

## Backend (Supabase)

Schema: `supabase/migrations/20261102120000_init.sql`.

| Table                                        | Notes                                                                                                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admins`                                     | `user_id` → `auth.users`, `name`, `role` (`owner`/`staff`). Managed in the SQL editor.                                                                                                                                      |
| `categories`, `products`                     | Text slug PKs (URL segments, immutable in the admin). `products.price/original_price/stock/active/is_new/bestseller/sort_order/specs jsonb`. Edited in `/admin/products` and `/admin/collections`.                          |
| `orders`                                     | `order_number` (sequence), `status`, `payment_method`, `payment_status`, totals, customer fields (phone normalised to `03XXXXXXXXX`, email lower-case), `notes` (customer), `internal_notes`, `courier`, `tracking_number`. |
| `order_items`                                | Snapshot of name/line/image/unit_price/original_price/qty at order time.                                                                                                                                                    |
| `order_events`                               | History: `created`/`status`/`payment`/`shipping`, with `actor` (admin user id).                                                                                                                                             |
| `contact_messages`, `newsletter_subscribers` | Form submissions.                                                                                                                                                                                                           |

Enums: `order_status` (pending → confirmed → packed → shipped → delivered; cancelled; returned),
`payment_method` (cod/bank), `payment_status` (unpaid/paid/refunded), `admin_role`.

**Access model (security-critical):**

- The app uses only the **publishable key**. No service-role/secret key exists in the code.
- Storefront writes go through `security definer` functions granted to `anon`:
  `create_order(p_customer jsonb, p_payment, p_items jsonb)` (validates input, takes prices from
  `products`, merges duplicate lines, max 5 per watch, locks rows and decrements stock, raises
  stable messages like `out_of_stock`/`invalid_phone`), `track_order(number, phone_or_email)`
  (no address/phone in the result), `submit_contact`, `subscribe_newsletter`.
- Admin pages use `createSessionClient()`; RLS policies require `is_admin()` (row in `admins`).
  Orders: select/update only (no insert/delete — cancel instead). `admin_dashboard()` checks
  `is_admin()` itself.
- The migration revokes Supabase's default grants and re-grants only what's needed.
- Trigger `on_order_update` logs status/payment/shipping changes to `order_events` with
  `auth.uid()`, returns stock when an order is cancelled, and blocks reopening a cancelled order.
- Error messages from the DB are mapped to copy by `friendlyDbError()` in `lib/orders.ts`.
- **Catalogue editing** (`lib/actions/catalog.ts`: `saveProduct`, `deleteProduct`,
  `saveCategory`, `deleteCategory`): `requireAdmin()` + session client, so the existing
  `is_admin()` RLS policies on products/categories apply. Ids/slugs are validated with
  `SLUG_PATTERN` and can't be changed after creation (URLs; past orders reference product ids).
  Deleting a product is safe for history (`order_items.product_id` → null; the item keeps its
  own name/price/photo). A collection can only be deleted when no product (hidden included)
  uses it. Shared field rules live in `lib/admin/catalog-fields.ts` (client + server).
- **Photos:** migration `20261103120000_catalog_images.sql` creates the public `catalog`
  bucket (4 MB, jpeg/png/webp/avif) with admin-only insert/update/delete/select policies on
  `storage.objects`. The server action uploads `image_file` to `products/<id>-<ts>.<ext>` or
  `collections/<slug>-<ts>.<ext>` (new name per upload; old files are kept because past orders
  point at them). `image` must be a bundled `/images/…` path or a URL in that bucket — next/image
  only allows that host (`images.remotePatterns` in `next.config.ts`, built from
  `NEXT_PUBLIC_SUPABASE_URL`). `serverActions.bodySizeLimit` is `4.4mb` (Vercel's body cap is
  4.5 MB).

**Auth:** Supabase email/password. Public sign-up must be disabled in the dashboard. Session
cookies via `@supabase/ssr`; `proxy.ts` refreshes them on `/admin/*`. `getAdmin()` verifies with
`auth.getUser()` and calls `connection()` first so admin pages are never prerendered.

Fonts come from `next/font/google` (self-hosted at build). Images are local files
(`public/images`) or admin uploads in Supabase Storage.

## Key design decisions

1. **One app, admin under `/admin`** (user decision 2026-11-02, over separate repos/monorepo):
   shared types/validation/design, one deploy, admin auth next to the code it protects.
   `(store)` route group keeps store chrome out of the admin.
2. **URL as state for shop filters.** Filter views are shareable and the unfiltered grid
   prerenders as the Suspense fallback.
3. **`useSyncExternalStore` stores instead of `useEffect` + `useState`.** This avoids
   hydration mismatches and keeps tabs in sync.
4. **Custom `Dropdown` replaces the native `<select>`** in the shop sort control so it matches
   the visual design. It implements the ARIA listbox keyboard model.
5. **Database is the authority for prices and stock.** The client sends only `{productId, qty}`;
   `create_order` recomputes everything. Client-side validation (`validateCheckout`) mirrors the
   SQL checks only for nicer messages.
6. **No secret key in the app.** Narrow `security definer` functions + RLS instead, so a leaked
   env var can't expose orders.
7. **Admin segments opt out of instant/static-shell validation** (`instant = false` on
   `app/admin/layout.tsx`, `login/page.tsx` and `(portal)/layout.tsx`): every admin page is
   per-user and request-time.

## Known gaps / next steps

- Admin catalogue editing is built but not yet exercised against the real project (needs the
  storage migration run + the user's OK to create test data). Admin forms use native controls;
  only one photo per product (no gallery yet).
- No order notification emails yet (Resend planned). Admin sees orders in the portal.
- PostgREST returns max 1000 rows per request: subscriber export/list need paging beyond that.
