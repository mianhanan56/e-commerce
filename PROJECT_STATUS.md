# Project Status — WAQT

_Last updated: 2026-11-03_

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
  `WQ-` numbers), tracking needs order number + phone/email, contact and newsletter saved
- **Admin portal `/admin`:** email/password login (admins only), dashboard stats, orders list
  (status tabs, search incl. phone, paging), order detail (status with cancel confirmation,
  payment, courier + tracking, internal notes, history, WhatsApp/call links, packing slip
  print), products (read-only, stock levels), messages inbox, subscribers + CSV export

## In progress

- Nothing mid-edit. Supabase is live; waiting on the user to disable public sign-ups.

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

- `next build` passes (2026-11-02), 50 pages. `/admin/*` render per request (`ƒ`).

## Deployment status

- A Vercel deployment exists (user's, built from GitHub `mianhanan56/e-commerce`, `main`).
- 2026-11-03: all backend/admin work committed and pushed to the **`master`** branch on GitHub
  (user's request). `main` (Vercel production) is still at `d64d808` until the user merges
  `master` into `main` or switches Vercel's production branch. Vercel needs
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as **Config** (not
  Secret) variables, then a redeploy.

## Recent progress

- 2026-10-30: Created the project with Create Next App.
- 2026-11-02: Commit `d64d808` built the full storefront.
- 2026-11-02: Sort Dropdown (browser-tested). Project memory files and `CLAUDE.md` added.
- 2026-11-02: Supabase schema + admin portal + store wiring; found and fixed during e2e:
  phone validation rejected "+92 321 7654321", failed admin login wiped the email field,
  `AdminNav.Fallback` undefined on the server, orders tabs clipped, broken SCSS import after
  the route-group move, `/admin` prerendered as static without env vars.
- 2026-11-02: Supabase project created and `.env.local` connected; schema not applied yet.
- 2026-11-03: Read-only DB check: schema, grants and seed (5 categories, 15 products) correct;
  public sign-up still enabled.
  Clearer admin sign-in errors; fixed the remaining "blocking route" dev insight on `/admin/login`.
- 2026-11-03: Migration, seed and owner admin applied on the real project; admin login works.
  Every `.env*` file git-ignored (no exceptions). Supabase MCP added (`.mcp.json`). Pushed to `master`.
