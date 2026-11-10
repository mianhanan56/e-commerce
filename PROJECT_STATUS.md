# Project Status — Zarvonique

_Last updated: 2026-11-11_

## Current milestone

**M2: Supabase backend + admin portal.** Code complete for orders, messages and subscribers;
the real Supabase project is connected (schema + seed applied, owner admin signs in). Full
end-to-end run on real Supabase still pending. M1 (design-phase storefront) is done.

## Completed features

- Global shell: announcement bar, header (nav, mobile drawer, search overlay, bag icon), footer
- Homepage: hero, benefits, signature collection, editorial banner, categories, why choose us,
  newsletter
- `/shop` with URL-driven category, search, sort and flag filters; custom sort `Dropdown`
- Collections index and five category pages; product pages for all 15 products
- Cart (drawer and page), wishlist, `localStorage` persistence with cross-tab sync
- About, contact, seven help and policy pages, 404 page, loading states for dynamic routes
- **Backend (Supabase):** schema, RLS, seed, `create_order` / `track_order` /
  `submit_contact` / `subscribe_newsletter` / `admin_dashboard` functions, audit trigger,
  setup guide
- **Store → database:** checkout places real orders (DB prices, stock reservation, sequential
  order numbers from a sequence), tracking needs order number + phone/email, contact and newsletter saved
- **Admin portal `/admin`:** email/password login (admins only), dashboard stats, orders list
  (status tabs, search incl. phone, paging), order detail (status with cancel confirmation,
  payment, courier + tracking, internal notes, history, WhatsApp/call links, packing slip
  print), messages inbox, subscribers + CSV export
- **Catalogue managed in the admin (2026-11-03, uncommitted):** storefront (shop, collections,
  product pages, home sections, footer, cart, search, wishlist) reads products and collections
  from Supabase (`lib/catalog.ts`, cached + tag-invalidated). Admin `/admin/products` and
  `/admin/collections`: add, edit, hide, delete, photo upload (Supabase Storage), position,
  new/best-seller flags, stock. Sold-out watches show a badge and can't be added to the bag.

- **Zarvonique logo (2026-11-10, uncommitted):** the user's logo replaces the old text
  wordmark in the header, mobile drawer, footer (stacked, with "Watches"), admin sidebar and
  admin login. New favicon, `icon.svg` and `apple-icon.png`.
- **Delivery time is 5–7 working days everywhere (2026-11-10):** shipping page (one row,
  "Anywhere in Pakistan"), FAQ, home benefits, cart, product page, checkout confirmation,
  track order.

- **Brand renamed to Zarvonique everywhere (2026-11-10):** titles, metadata, copy, help pages,
  admin, storage keys, README. New order prefix `ZV-`: migration `20261110120000_order_number_prefix.sql` written, the user still has to run it.
- **Contact (2026-11-10):** zarvonique@gmail.com, 24 hours Monday – Sunday, no address (contact
  page + footer). **Home:** Hero, Benefits, "Our Watches" (first 8 shop watches), Why Choose Us. Signature Collection, Shop by Category, The Edit banner and the newsletter section removed; no "collection" wording left in the store.
- **Collections pages removed (2026-11-10):** menu link gone; collection links open the
  filtered shop; old URLs redirect. **Header redesigned around the logo:** black, full stacked
  Zarvonique logo in the artwork's gold.

- **SEO foundations (2026-11-11):** `robots.txt`, `sitemap.xml` (products + categories from the
  catalogue), canonical URLs, full Open Graph/Twitter tags on every page (`lib/seo.ts`
  `pageMetadata`), `noindex` on bag/checkout/wishlist, JSON-LD (OnlineStore + WebSite, Product
  with offer/shipping/returns, CollectionPage, BreadcrumbList), 1200×630 share image
  `public/og-image.jpg`, keyword titles ("Noir Automatic — Men's Business Watch"),
  `lang="en-PK"`.
- **Indexable category pages `/shop/<slug>` (2026-11-11):** same shop UI with the category
  selected, but server-rendered with its own title, intro, story block and product list. Chips
  are links. `/shop?category=` and `/collections/*` now 308 to them.

## In progress

- Nothing mid-edit. User: run `supabase/migrations/20261103120000_catalog_images.sql` (photo
  uploads fail with a clear message until then), disable public sign-ups, add the two env vars
  in Vercel, commit + push the catalogue work.

## Pending

See `TODO.md`. Next: verify on real Supabase, Phase 4 (products from DB + admin editing),
order notifications, placeholder content, tests, deploy configuration.

## Testing status

- No test framework in the repo.
- 2026-11-02: SQL verified with 33 assertions in a scratch PGlite harness; full storefront +
  admin flow verified end-to-end in a browser against PGlite behind a PostgREST/GoTrue shim.
  Both harnesses were deleted afterwards (per project rules). Not yet run on real Supabase.
- 2026-11-02: `npx tsc --noEmit`, `npm run lint`, `prettier --check` clean.

## Build status

- `next build` passes (2026-11-11), 58 pages incl. robots.txt, sitemap.xml and 5 `/shop/<slug>`. `/admin/*` render per request (`ƒ`).

## Deployment status

- A Vercel deployment exists (user's, built from GitHub `mianhanan56/e-commerce`, `main`).
- 2026-11-03: all backend/admin work committed and pushed to the **`master`** branch on GitHub
  (user's request). `main` (Vercel production) is still at `d64d808` until the user merges
  `master` into `main` or switches Vercel's production branch. Vercel needs
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as **Config** (not
  Secret) variables, then a redeploy.

## Recent progress

- 2026-11-11: SEO work (see Completed). Checked on a production build (`next start -p 3002`,
  sample catalogue because Supabase is unreachable): robots/sitemap content; title, description,
  canonical, og:*, twitter on home, shop, all page types; JSON-LD parses (Product price PKR +
  InStock, CollectionPage items, breadcrumbs); bag/checkout/wishlist `noindex, follow`;
  `/shop/sports` HTML lists only its 3 watches; redirects 308 (`/shop?category=sports&sort=…` →
  `/shop/sports?sort=…`). Headless Chrome 1440 + 375: chip links navigate, flags/sort keep the
  path, "All" returns to `/shop`, no console errors. Fixed a pre-existing 12px horizontal scroll
  on `/shop` under ~390px (`.refine { min-width: 0 }`). tsc, lint, prettier (changed files), build pass.

- 2026-10-30: Created the project with Create Next App.
- 2026-11-02: Commit `d64d808` built the full storefront.
- 2026-11-02: Sort Dropdown (browser-tested). Project memory files and `CLAUDE.md` added.
- 2026-11-02: Supabase schema + admin portal + store wiring; found and fixed during e2e:
  phone validation rejected "+92 321 7654321", failed admin login wiped the email field,
  `AdminNav.Fallback` undefined on the server, orders tabs clipped, broken SCSS import after
  the route-group move, `/admin` prerendered as static without env vars.
- 2026-11-02: Supabase project created and `.env.local` connected; schema not applied yet.
- 2026-11-03: Cleared every dev console warning (21 pages × desktop/mobile, headless Chrome):
  `<html suppressHydrationWarning>` for extension-injected attributes; eager loading for
  above-the-fold images (shop first row, collections index, collection page grid); product
  gallery image no longer has a sticky `fill` parent. Lint, tsc and build clean.
- 2026-11-03: Read-only DB check: schema, grants and seed (5 categories, 15 products) correct;
  public sign-up still enabled.
  Clearer admin sign-in errors; fixed the remaining "blocking route" dev insight on `/admin/login`.
- 2026-11-03: Migration, seed and owner admin applied on the real project; admin login works.
  Every `.env*` file git-ignored (no exceptions). Supabase MCP added (`.mcp.json`). Pushed to `master`.
- 2026-11-03: Phase 4 built: catalogue from Supabase + admin product/collection editing with
  photo upload. Verified: tsc, lint, isolated production build (55 pages, product/collection
  params from the real DB), Playwright against that build with real Supabase (read-only): all
  store pages 200, counts/filters/footer/search/cart from DB, no console errors, admin routes
  redirect to login; admin forms (scratch-only preview page) render on desktop + mobile, ID
  auto-slug, client photo checks. **Not yet run:** real admin saves/deletes/uploads (DB writes).
- 2026-11-10: New logo + 5–7 working days copy. The header's inline nav now starts at `xl`
  (1280px), because the wider logo made "About Us" wrap at 1024px. Below that the drawer is used.
  Checked in headless Chrome against the sample catalogue at 320–1920px: logo centred, no
  overflow, no console errors. tsc, lint and prettier pass.
- 2026-11-10: **Store shows "Couldn't load the catalogue: TypeError: fetch failed".** Cause:
  `yvzfpgnxqcabdgvmivyr.supabase.co` returns NXDOMAIN (1.1.1.1 and the local resolver), while
  supabase.com resolves. The Supabase project is paused or deleted. The user has to restore it
  in the Supabase dashboard. The store no longer crashes in the meantime: `getCatalog()` serves
  the sample catalogue while Supabase is unreachable and retries every minute. On :3002 all store
  pages return 200 with no error overlay.
- 2026-11-10: Removed the collection pages and redesigned the header (black, stacked logo).
  Checked on :3002: `/collections` → `/shop` and `/collections/classic` →
  `/shop?category=classic` (Classic chip active); product breadcrumb/eyebrow link to the filtered
  shop; header logo centred 360–1920px, nav on one line from 1024px, no horizontal overflow, no
  console errors. tsc and lint pass.
