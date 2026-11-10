import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Only the admin portal is blocked. Bag, checkout and wishlist are kept out of results
      // with a `noindex` tag instead: a crawler blocked here could never read that tag, and
      // since every page links to them, Google could still list the bare URLs.
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
