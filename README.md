# Zarvonique — Men's Watches

Men's watch store for Pakistan with an admin portal, in one Next.js 16 app. Orders, contact
messages and newsletter sign-ups are stored in **Supabase**; the admin portal at `/admin`
manages them. Cart and wishlist are client state in `localStorage` (`lib/persisted.ts`).

**Setup:** follow [`supabase/README.md`](supabase/README.md), then create `.env.local` with
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Env files are never
committed (`.env*` is git-ignored). Without it the store still runs, but checkout, tracking, contact and the
newsletter show a "not connected yet" message and `/admin` can't sign in.

## Routes

| Route                                   | What it is                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                                     | Homepage                                                                                 |
| `/shop`                                 | All watches — filters via `?category=`, `?q=`, `?sort=`, `?filter=new\|sale\|bestseller` |
| `/collections`, `/collections/[slug]`   | Collection index and per-category pages                                                  |
| `/products/[id]`                        | Product detail                                                                           |
| `/cart`, `/checkout`                    | Bag and checkout (cash on delivery / bank transfer)                                      |
| `/wishlist`                             | Saved watches                                                                            |
| `/track-order`                          | Order status lookup (order number + phone or email)                                      |
| `/about`, `/contact`                    | Brand story, contact form                                                                |
| `/help/[slug]`                          | shipping, returns, warranty, size-guide, faq, privacy, terms                             |
| `/admin`                                | Admin dashboard (sign in at `/admin/login`; admins only)                                 |
| `/admin/orders`, `/admin/orders/[id]`   | Orders: status, payment, courier + tracking, notes, history, packing slip                |
| `/admin/products`                       | Catalogue and stock (read-only for now)                                                  |
| `/admin/messages`, `/admin/subscribers` | Contact inbox; newsletter list + CSV export                                              |

Header search opens an overlay with live results; the bag icon opens a cart drawer.

```bash
npm run dev
```

## Structure

- `styles/_tokens.scss` — colour palette, type scale, spacing, breakpoints, mixins
- `components/ui` — Button, Icon, Reveal (scroll animation), SectionHeading
- `components/ui` also has PageHeader (+ breadcrumbs), Container, EmptyState, Form styles
- `components/layout` — AnnouncementBar, Header (+ mobile drawer), Footer, Wordmark
- `components/home` — one component per homepage section
- `components/cart` — cart + wishlist context and views
- `components/admin` — admin shell, shared admin UI kit, dashboard/orders/products/messages
- `lib/supabase`, `lib/actions`, `lib/admin`, `lib/orders.ts` — backend clients, server actions,
  admin auth, shared order rules; `proxy.ts` — admin session refresh
- `supabase/` — migrations, seed and setup guide
- `components/{product,shop,search,checkout,about,contact,help,track}` — page features
- `data/catalog.ts` — 15 placeholder products (PKR) and 5 categories
- `data/help.ts` — help centre and policy copy

## Design system

- Colour: ink `#0d0d0c`, paper `#f7f4ee`, champagne gold `#b8996a` (light `#dcc8a3`)
- Type: Cormorant Garamond (headings) + Jost (body), fluid `clamp()` scale
- Spacing: 4px base, `$space-1`…`$space-10`; section padding `$section-y`
- Breakpoints: 480 / 768 / 1024 / 1280 / 1440, mobile first

Photos in `public/images` are Unsplash placeholders, and the social links and phone number
are placeholders too. The site address (for canonical URLs and the sitemap) defaults to the
Vercel URL in `lib/seo.ts`; set `NEXT_PUBLIC_SITE_URL` to override it. Several show real brand logos
(Rolex, MVMT, Fossil) — replace them with your own product photography before launch.
