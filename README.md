# WAQT — Men's Watches

Design-phase frontend for a men's watch store in Pakistan. No backend, auth, Supabase or
APIs yet: cart, wishlist and orders are client state persisted to `localStorage`
(`lib/persisted.ts`), so they survive reloads but live only in the visitor's browser.

## Routes

| Route                                 | What it is                                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/`                                   | Homepage                                                                                 |
| `/shop`                               | All watches — filters via `?category=`, `?q=`, `?sort=`, `?filter=new\|sale\|bestseller` |
| `/collections`, `/collections/[slug]` | Collection index and per-category pages                                                  |
| `/products/[id]`                      | Product detail                                                                           |
| `/cart`, `/checkout`                  | Bag and checkout (cash on delivery / bank transfer)                                      |
| `/wishlist`                           | Saved watches                                                                            |
| `/track-order`                        | Order status lookup (orders placed in this browser)                                      |
| `/about`, `/contact`                  | Brand story, contact form                                                                |
| `/help/[slug]`                        | shipping, returns, warranty, size-guide, faq, privacy, terms                             |

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
- `components/cart` — cart + wishlist context and views; `components/orders` — placed orders
- `components/{product,shop,search,checkout,about,contact,help,track}` — page features
- `data/catalog.ts` — 15 placeholder products (PKR) and 5 categories
- `data/help.ts` — help centre and policy copy

## Design system

- Colour: ink `#0d0d0c`, paper `#f7f4ee`, champagne gold `#b8996a` (light `#dcc8a3`)
- Type: Cormorant Garamond (headings) + Jost (body), fluid `clamp()` scale
- Spacing: 4px base, `$space-1`…`$space-10`; section padding `$section-y`
- Breakpoints: 480 / 768 / 1024 / 1280 / 1440, mobile first

Photos in `public/images` are Unsplash placeholders, and the social links, phone number and
`waqt.pk` domain are placeholders too. Several show real brand logos
(Rolex, MVMT, Fossil) — replace them with your own product photography before launch.
