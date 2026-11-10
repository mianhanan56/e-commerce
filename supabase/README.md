# Supabase setup

The store and admin portal use one Supabase project. The schema lives in
`migrations/`; `seed.sql` loads the 15 launch products (stock 10 each — adjust later).

## 1. Create the project

1. Create a project at [supabase.com](https://supabase.com). Pick the region closest to
   Pakistan (e.g. Mumbai / `ap-south-1`).
2. **Project Settings → API Keys**: copy the project URL and the **publishable** key.
   The app never needs the secret (service-role) key — don't add it anywhere.

## 2. Create the tables

Either paste into **SQL Editor** and run, in this order:

1. `migrations/20261102120000_init.sql`
2. `migrations/20261103120000_catalog_images.sql` (photo storage for the admin; safe to re-run)
3. `migrations/20261110120000_order_number_prefix.sql` (new orders numbered `ZV-…`; safe to re-run)
3. `seed.sql`

or, with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push            # applies migrations/
# then run seed.sql once in the SQL Editor
```

## 3. Lock down sign-ups

**Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up".
Admin accounts are created by you, never by visitors. (Even if someone signed up, they could
not see anything: admin access also requires a row in `public.admins`.)

## 4. Create your admin account

1. **Authentication → Users → Add user → Create new user**: your email + a strong password,
   tick "Auto confirm user".
2. In **SQL Editor**, give that user admin access:

```sql
insert into public.admins (user_id, name, role)
select id, 'Your Name', 'owner' from auth.users where email = 'you@example.com';
```

Staff later: same two steps with `'staff'`.

## 5. Connect the app

Create `.env.local` in the repo root (git-ignored, like every `.env*` file — never commit it):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then restart `npm run dev`.

Add the same two variables in **Vercel → Project → Settings → Environment Variables**, then
redeploy. Sign in at `/admin/login`.

## 6. After the project exists (optional)

Regenerate the TypeScript types from the real schema:

```bash
npx supabase gen types typescript --project-id <ref> --schema public > lib/supabase/database.types.ts
```

The generated file replaces `lib/supabase/database.types.ts` only. App code imports from
`lib/supabase/types.ts`, which derives its names from it and keeps the hand-written
result shapes (`TrackedOrder`, `DashboardStats`).

## How access works

| Who                        | Can do                                                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visitors (publishable key) | Read active products/categories; call `create_order`, `track_order` (needs number **and** phone/email), `submit_contact`, `subscribe_newsletter`                              |
| Signed-in non-admin        | Nothing beyond visitors                                                                                                                                                       |
| Admin (row in `admins`)    | Read/update orders and messages; add/edit/delete products and collections and upload their photos; read subscribers. Orders can't be deleted — cancel instead (returns stock) |

Every status, payment and shipping change is written to `order_events` by a trigger,
with the admin who made it.
