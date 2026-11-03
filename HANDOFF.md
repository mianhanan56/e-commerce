# Handoff — WAQT Men's Watches

_Last updated: 2026-11-03 (Supabase connected, pushed to `master`). Any coding agent should be able
to continue the project from this file. Read `ARCHITECTURE.md`, `PROJECT_STATUS.md` and
`TODO.md` too. If the files disagree, trust them in this order: source code, ARCHITECTURE,
PROJECT_STATUS, HANDOFF, TODO._

## Project overview

WAQT is a premium men's watch store for Pakistan (PKR, cash on delivery, bank transfer) built
with Next.js 16 / React 19 / Sass modules. One app contains the storefront and an **admin
portal at `/admin`**. The backend is **Supabase** (Postgres + Auth). The storefront catalogue
is still rendered from `data/catalog.ts`; orders, contact messages and newsletter sign-ups go
to Supabase.

## Current objective

The Supabase project is connected and the owner admin signs in. Next: verify the full store +
admin flow against real data (needs the user's OK — it writes test orders). After that: Phase 4 (products from the
database + product editing in the admin) and order notification emails.

## Implementation status

- Storefront: complete (commit `d64d808`) plus uncommitted work below.
- **Committed and pushed to `master` on 2026-11-03** at the user's explicit request (normally the
  user commits). `main` / Vercel production is still `d64d808`:
  - Sort `Dropdown` on `/shop` (`components/ui/Dropdown.*`). Browser-tested: mouse, keyboard,
    outside click, Escape, mobile.
  - Store routes moved into `app/(store)/` (URLs unchanged); `StoreShell` holds store chrome.
  - Supabase schema `supabase/migrations/20261102120000_init.sql`, `supabase/seed.sql`,
    setup guide `supabase/README.md`. (`.env.example` exists locally but is git-ignored: the
    user wants no env file of any kind committed.)
  - `lib/supabase/*`, `lib/orders.ts`, `lib/actions/{store,admin}.ts`, `lib/admin/auth.ts`,
    `proxy.ts`.
  - Checkout, track order, contact form and newsletter now call server actions.
    `components/orders/OrdersContext.tsx` (localStorage orders) was removed.
  - Admin portal: login, dashboard, orders list + detail (status/payment/shipping/notes,
    history, print packing slip), products (read-only), messages inbox, subscribers + CSV.
- **Verification done (2026-11-02):**
  - `tsc`, `eslint`, `prettier --check`, isolated `next build` all pass.
  - SQL: 33 checks in a scratch PGlite harness (ordering, stock locking/rollback, validation,
    tracking privacy, cancel → restock, audit log, RLS for anon / non-admin / admin).
  - End-to-end: the production build ran against PGlite behind a small PostgREST/GoTrue shim
    (scratch, deleted afterwards). Placed orders, oversell rejection, contact, newsletter,
    tracking, admin login (wrong + right password), dashboard, search, filters, status /
    shipping / payment / notes updates, history, messages handled, CSV export, cancel →
    restock, sign-out, mobile layout. No console or server errors at the end.
  - **Not yet verified against a real Supabase project** (none exists). Real Supabase Auth
    cookies/JWT verification and PostgREST behaviour may differ from the shim.
- Without `.env.local`, the store shows "Online ordering isn't connected yet…" on checkout /
  contact / newsletter / tracking, and `/admin/*` redirects to a login page that explains setup.

## Important technical decisions

- **Next.js 16 is newer than most training data.** Read `node_modules/next/dist/docs/` before
  touching routing, caching or data APIs. `cacheComponents` and `partialPrefetching` are on.
  `middleware` is now `proxy.ts`. `params`/`searchParams` are Promises.
- **Admin pages are request-time:** `app/admin/layout.tsx`, `app/admin/login/page.tsx` and
  `app/admin/(portal)/layout.tsx` export `instant = false` (the root one alone didn't silence
  the dev "blocking route" insight for the segments below it);
  `getAdmin()` calls `connection()` first (otherwise `/admin` was prerendered as a static
  redirect when env vars were missing at build time).
- **No secret key in the app.** Store writes use `security definer` SQL functions granted to
  `anon`; admin uses the user's session with RLS (`is_admin()`). The migration revokes
  Supabase's default grants first. Keep it that way.
- **Prices/stock are decided by the database** (`create_order`), never by the client.
- Static properties on client components don't survive the server/client boundary (bug found:
  `AdminNav.Fallback` was `undefined` on the server → use separate exports).
- React 19 resets forms after an action: `signIn` returns the email so the login form keeps it.
- Admin uses `font-variant-numeric: lining-nums` (the serif's old-style 1/0 read as I/o).
- Persisted client state goes through `lib/persisted.ts`; shop filters live in the URL.
- Styling: co-located `*.module.scss` with a relative `@use ".../styles/tokens" as *;` —
  **count the depth** (moving routes into `(store)` broke one import once).
- `<html>` in `app/layout.tsx` has `suppressHydrationWarning` (2026-11-03): a browser extension
  added `style="filter: none"` before hydration. It only covers `<html>`'s own attributes —
  don't add it deeper; a mismatch inside `<body>` is a real bug.

## Environment setup

- `npm install`, then `npm run dev` (**port 3002**; check `ss -ltnp | grep 3002` first).
- Supabase: follow `supabase/README.md`, then create `.env.local` (git-ignored) with
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Restart dev.
- `next dev` regenerates the block in `AGENTS.md`. Leave it alone.
- **Supabase MCP** (2026-11-03): `.mcp.json` (project scope) registers the hosted Supabase MCP
  server for project `yvzfpgnxqcabdgvmivyr` with docs/account/database/debugging/development/
  functions/branching/feedback features. It needs OAuth via `/mcp` in an interactive Claude
  Code session. It can write to the production database: per `CLAUDE.md`, only run writes
  (`apply_migration`, `execute_sql` that modifies data, branching, functions) when the user
  explicitly asks; reads (list tables, advisors, logs) are fine.
- If `tsc` complains about `.next/types/validator.ts` after route changes, run
  `npx next typegen` (stale generated route types).
- Running `next build` in the repo while the user's dev server runs once coincided with the dev
  server dying. Prefer building an isolated copy (rsync without `.next`/`.git`) in a scratch dir.

## Useful commands

| Command            | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Dev server on :3002                        |
| `npm run build`    | Production build                           |
| `npm run lint`     | ESLint                                     |
| `npx tsc --noEmit` | Typecheck                                  |
| `npx next typegen` | Regenerate route types after adding routes |

## Known bugs and limitations

- Storefront products come from `data/catalog.ts`; editing prices/stock in Supabase affects
  checkout totals and stock but not what the product pages display. Keep them in sync until
  Phase 4.
- No email/WhatsApp notification on new orders yet — the owner must check `/admin`.
- Subscriber list/export is capped at 1000 rows (PostgREST default max rows).
- Placeholder photos include real brand logos; domain, phone and social links are placeholders.

## Supabase project state (2026-11-02)

- Project ref `yvzfpgnxqcabdgvmivyr` (`https://yvzfpgnxqcabdgvmivyr.supabase.co`). URL and
  publishable key are in `.env.local` (git-ignored); the dev server on :3002 loaded them.
- Read-only probe: key valid, **schema not applied yet** (`products` → PGRST205), public
  sign-up still **enabled**. Owner admin email given by the user: `zarvonique@watch.com`
  (never store the password in files).
- 2026-11-02 (later): user reported "That email and password don't match an account" on
  `/admin/login`. Diagnosis: schema still not applied (PGRST205) and Supabase Auth returns
  `invalid_credentials` for that email + the password from chat → auth user not created yet
  (or created with a different password). Not an app bug. `signIn` now reports unconfirmed
  accounts, a missing schema and missing `admins` rows separately.
- 2026-11-03: **migration applied** (verified read-only: catalogue tables readable by anon,
  private tables and `admin_dashboard` denied to anon, `track_order` callable). A re-run gave
  `type "order_status" already exists` — harmless, don't re-run. Seed applied too
  (5 categories, 15 products, verified 2026-11-03).
- 2026-11-03: auth user + `admins` owner row created; **user signed in to `/admin`
  successfully**. Public sign-up still enabled (user asked to disable it).
- 2026-11-03 (re-check, read-only via publishable key): 5 categories + 15 products (stock 10,
  all active) readable by anon; `admins`, `orders`, `order_items`, `order_events`,
  `contact_messages`, `newsletter_subscribers` and `admin_dashboard` all 401 for anon (grants
  as intended); `track_order` callable. Auth settings: `disable_signup: false` — **public
  sign-up is still enabled**. Supabase MCP still un-authorized, so row counts of private
  tables were not checked.
- Waiting on the user to disable sign-ups (Authentication → Sign In / Providers → Email).

## Current blockers

- **User must disable public sign-ups** in the Supabase dashboard (project, schema, seed and
  admin user are done). Agents must not modify databases without explicit instruction.
- Decisions still open: notification channel (email / Telegram / WhatsApp), staff accounts and
  permissions, real stock numbers, production domain.

## Recommended next step

1. With the user's OK: place a test order on the store and walk the admin flow on the real
   project. Fix anything that differs from the shim.
2. Phase 4: storefront reads products from Supabase (`'use cache'` + `cacheTag`, `updateTag`
   from admin actions), admin product editing + image upload (Supabase Storage).
3. Order emails (Resend) once a domain exists.

## Rules for agents (from the project owner)

- Never delete the memory files. Never commit.
- Never change databases, production systems or cloud resources without explicit instructions.
- Delete any test files written to check a task once the task is done.
- Update the memory files as work happens, not at the end of the session.
