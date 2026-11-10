import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The collection pages were removed (2026-11-10): a collection is now the shop with that
  // category selected, at /shop/<slug>. Permanent (308) so search engines move any ranking over.
  // Old /shop?category=<slug> links are redirected by proxy.ts, which can drop the parameter.
  async redirects() {
    return [
      { source: "/collections", destination: "/shop", permanent: true },
      { source: "/collections/:slug", destination: "/shop/:slug", permanent: true },
    ];
  },
  images: {
    // Product and collection photos uploaded in the admin live in the public "catalog" bucket.
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/catalog/**`)]
      : [],
  },
  experimental: {
    serverActions: {
      // Admin photo uploads (capped at 4 MB in lib/actions/catalog.ts) plus form overhead.
      // Vercel rejects request bodies over 4.5 MB, so don't raise the photo cap past that.
      bodySizeLimit: "4.4mb",
    },
  },
};

export default nextConfig;
