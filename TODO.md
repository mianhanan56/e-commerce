# TODO — Zarvonique

_Last updated: 2026-11-12. Record finished tasks in `PROJECT_STATUS.md` before removing them._

## High

- [ ] **Restore the Supabase project.** Status: Blocked (user action). Since 2026-11-10 its
      hostname returns NXDOMAIN. The store now falls back to the sample catalogue (no more
      500s), but orders, tracking, forms and admin sign-in need the database. Restore or unpause
      it in the Supabase dashboard. The real catalogue reappears within about a minute.
- [ ] **Run the order-number prefix migration.** Status: Pending (user action).
      `supabase/migrations/20261110120000_order_number_prefix.sql` in the SQL Editor once the
      project is restored. Makes new orders `ZV-…`; code and placeholders already use `ZV`.
- [ ] **About page studio section and warranty drop-off text.** Status: Pending (user decision).
      Contact page/footer no longer show an address and hours are 24/7, but About still shows
      "Visit the studio … MM Alam Road … Mon–Sat 10am–8pm" and the warranty page mentions the
      Gulberg studio.

- [ ] **Create and connect the Supabase project.** Status: In Progress (user action).
      2026-11-03: project created, `.env.local` written, migration + seed + admin user + `admins` row done; sign-up lock
      still to do in the dashboard.
      Left: disable public sign-ups; add the two env vars in Vercel (Config type) and get `master`
      onto `main` so production deploys it. Agents must not touch the database without explicit
      instruction.
- [ ] **Verify store + admin against real Supabase.** Status: Pending (after the above).
      Place an order, track it, sign in to `/admin`, change status/shipping/payment, cancel one
      (stock returns), messages, CSV export. Verified so far only against a local shim.
- [ ] **Run the photo-storage migration and test catalogue editing on real Supabase.**
      Status: Pending (user action / needs explicit OK for test writes). Run
      `supabase/migrations/20261103120000_catalog_images.sql` in the SQL Editor, then in
      `/admin`: add a test watch with a photo, edit it, hide it, delete it; add + delete an empty
      collection; check the store updates at once. Code done and browser-checked read-only.
- [ ] **Product photo gallery (several photos per watch).** Status: Pending. Today one `image`
      per product; would need an `images text[]` column or a `product_images` table.
- [ ] **Replace placeholder product and editorial photos.** Status: Pending.
      Some images in `public/images` show real brand logos (Rolex, MVMT, Fossil).
- [ ] **Replace placeholder business details.** Status: Pending.
      Phone number, social links. (Domain: the site uses the Vercel address until a custom
      domain is bought.)

- [ ] **SEO: Search Console + sitemap.** Status: Pending (user action). Site origin is
      `https://e-commerce-six-pi-26.vercel.app` (default in `lib/seo.ts`, 2026-11-11). Deploy the
      SEO work to `main`, add a URL-prefix property in Google Search Console (HTML-tag
      verification: add the code via `metadata.verification.google` in `app/layout.tsx`), submit
      `/sitemap.xml`, check a product in the Rich Results Test. If a custom domain is bought:
      set `NEXT_PUBLIC_SITE_URL` in Vercel (Config type) and redeploy.
- [ ] **SEO: consistent business details.** Status: Pending (user decision). About page shows a
      Lahore studio address and Mon–Sat hours; Contact/footer show no address and 24/7. Phone and
      social links are placeholders, so `lib/seo.ts` `organizationJsonLd()` omits `telephone`/
      `sameAs` (add them when real). "Rated 4.9 / 5" (Hero, About) has no reviews behind it.

## Medium

- [ ] **New-order notifications.** Status: Blocked (user decision: email / Telegram /
      WhatsApp). Email via Resend needs a verified domain. Also customer confirmation email.
- [ ] **Staff accounts with limited permissions.** Status: Pending (user decision).
      Schema has `admins.role` (`owner`/`staff`); nothing restricts staff yet.
- [ ] **Add a committed test setup.** Status: Pending. Candidates: SQL tests for the
      migration (PGlite worked well), unit tests for `lib/orders.ts`, Playwright e2e for checkout
      and admin. Needs the user's OK since project rules delete ad-hoc test files.
- [ ] **Deep-link tracking from the confirmation page** (`/track-order?order=ZV-…`).
      Status: Pending. Needs `useSearchParams` under Suspense.

- [ ] **Design: sticky "Add to Bag" bar on the phone product page.** Status: Pending (user
      decision). On phones the button scrolls away under the specs; a slim fixed bar with price
      + button would keep it in reach. Found in the 2026-11-12 design review.

## Low

- [ ] **Design: announcement bar wraps to two lines at 320px.** Status: Pending. Shorten the
      text or reduce letter-spacing below `sm`.
- [ ] **Design: home page is short** (hero, benefits, 8 watches, why choose us). Status: Pending
      (user decision; the user removed the other sections on 2026-11-10). Real customer reviews
      would be the most useful addition once they exist.

- [ ] **SEO content.** Status: Pending. Longer product copy, customer reviews (then
      `aggregateRating` in Product JSON-LD), guides ("best watches under Rs 20,000", case-size
      guide), FAQPage JSON-LD on `/help/faq` (rich results limited, still read by Bing/AI).
- [ ] **`Reveal` hides content until JS runs** (`opacity: 0`). Status: Pending. Google renders JS,
      but a no-JS/CSS-only fallback would be safer.
- [ ] **Subscriber list/export beyond 1000 rows.** Status: Pending. Page through PostgREST
      ranges in `app/admin/(portal)/subscribers/export/route.ts`.
- [ ] **Courier API integration** (PostEx/Trax booking + tracking). Status: Pending.
- [ ] **Online payments** (Safepay / PayFast / JazzCash / Easypaisa). Status: Pending.
