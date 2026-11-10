import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The collection pages were removed (2026-11-10): a collection is now the shop filtered to it.
  // Temporary redirects keep old links and bookmarks working.
  async redirects() {
    return [
      { source: "/collections", destination: "/shop", permanent: false },
      { source: "/collections/:slug", destination: "/shop?category=:slug", permanent: false },
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
