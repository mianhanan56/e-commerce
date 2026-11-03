# TODO — WAQT

_Last updated: 2026-11-03. Record finished tasks in `PROJECT_STATUS.md` before removing them._

## High

- [ ] **Create and connect the Supabase project.** Status: In Progress (user action).
      2026-11-03: project created, `.env.local` written, migration + seed + admin user + `admins` row done; sign-up lock
      still to do in the dashboard.
      Left: disable public sign-ups; add the two env vars in Vercel (Config type) and get `master`
      onto `main` so production deploys it. Agents must not touch the database without explicit
      instruction.
- [ ] **Verify store + admin against real Supabase.** Status: Pending (after the above).
      Place an order, track it, sign in to `/admin`, change status/shipping/payment, cancel one
      (stock returns), messages, CSV export. Verified so far only against a local shim.
- [ ] **Phase 4: products from the database + admin product editing.** Status: Pending.
      Storefront reads catalogue from Supabase (`'use cache'` + `cacheTag`; admin actions call
      `updateTag`). Admin: edit price/sale price/stock/active/specs, add products, image upload to
      Supabase Storage. Until then `data/catalog.ts` and the `products` table must be kept in sync
      by hand.
- [ ] **Replace placeholder product and editorial photos.** Status: Pending.
      Some images in `public/images` show real brand logos (Rolex, MVMT, Fossil).
- [ ] **Replace placeholder business details.** Status: Pending.
      `waqt.pk` domain (`metadataBase` in `app/layout.tsx`), phone number, social links.

## Medium

- [ ] **New-order notifications.** Status: Blocked (user decision: email / Telegram /
      WhatsApp). Email via Resend needs a verified domain. Also customer confirmation email.
- [ ] **Staff accounts with limited permissions.** Status: Pending (user decision).
      Schema has `admins.role` (`owner`/`staff`); nothing restricts staff yet.
- [ ] **Add a committed test setup.** Status: Pending. Candidates: SQL tests for the
      migration (PGlite worked well), unit tests for `lib/orders.ts`, Playwright e2e for checkout
      and admin. Needs the user's OK since project rules delete ad-hoc test files.
- [ ] **Deep-link tracking from the confirmation page** (`/track-order?order=WQ-…`).
      Status: Pending. Needs `useSearchParams` under Suspense.

## Low

- [ ] **Subscriber list/export beyond 1000 rows.** Status: Pending. Page through PostgREST
      ranges in `app/admin/(portal)/subscribers/export/route.ts`.
- [ ] **Courier API integration** (PostEx/Trax booking + tracking). Status: Pending.
- [ ] **Online payments** (Safepay / PayFast / JazzCash / Easypaisa). Status: Pending.
