import type { MetadataRoute } from "next";
import { helpPages } from "@/data/help";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

// Every indexable storefront URL. Products and categories come from the catalogue, so a watch
// added in the admin appears here once the "catalog" cache tag is refreshed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories } = await getCatalog();

  const page = (
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly",
    images?: string[],
  ) => ({ url: absoluteUrl(path), priority, changeFrequency, images });

  return [
    page("/", 1, "weekly"),
    page("/shop", 0.9, "daily"),
    ...categories.map((c) => page(`/shop/${c.slug}`, 0.8, "weekly", [absoluteUrl(c.image)])),
    ...products.map((p) => page(`/products/${p.id}`, 0.8, "weekly", [absoluteUrl(p.image)])),
    page("/about", 0.5, "monthly"),
    page("/contact", 0.5, "monthly"),
    page("/track-order", 0.3, "yearly"),
    ...helpPages.map((h) => page(`/help/${h.slug}`, 0.3, "monthly")),
  ];
}
