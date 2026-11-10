import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  sampleCategories,
  sampleProducts,
  type Catalog,
  type Category,
  type Product,
} from "@/data/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";

// Every storefront page that shows products depends on this tag. Admin catalogue actions
// call updateTag(CATALOG_TAG) so edits appear at once; orders refresh it in the background
// because they change stock.
export const CATALOG_TAG = "catalog";

const SPEC_KEYS = [
  "movement",
  "caseSize",
  "caseMaterial",
  "strap",
  "glass",
  "waterResistance",
] as const satisfies readonly (keyof Product["specs"])[];

export function toProduct(row: ProductRow): Product {
  const raw = (row.specs ?? {}) as Record<string, unknown>;
  const specs = Object.fromEntries(
    SPEC_KEYS.map((k) => [k, typeof raw[k] === "string" ? raw[k] : ""]),
  ) as Product["specs"];
  return {
    id: row.id,
    name: row.name,
    line: row.line,
    image: row.image,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    description: row.description,
    specs,
    isNew: row.is_new,
    bestseller: row.bestseller,
    stock: row.stock,
  };
}

function toCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    story: row.story,
    image: row.image,
  };
}

// Live products and all collections, in admin-defined order. Anonymous reads only see
// active products (RLS), so hidden watches never reach the store.
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);

  if (!isSupabaseConfigured()) {
    cacheLife("hours");
    return { products: sampleProducts, categories: sampleCategories };
  }

  const supabase = createPublicClient();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").order("sort_order").order("name"),
    supabase.from("categories").select("*").order("sort_order").order("name"),
  ]);
  const error = productsRes.error ?? categoriesRes.error;

  // Supabase couldn't be reached (network down, project paused, DNS). supabase-js reports
  // that as an error without a code. Keep the store browsable with the bundled catalogue and
  // try again within a minute instead of failing every page.
  if (error && !error.code) {
    console.warn(
      `Catalogue: Supabase unreachable (${error.message}); showing the sample catalogue.`,
    );
    cacheLife("minutes");
    return { products: sampleProducts, categories: sampleCategories };
  }
  // A real database error (missing table, bad grant): fail loudly rather than cache an empty shop.
  if (error) throw new Error(`Couldn't load the catalogue: ${error.message}`);

  // Edits made outside the admin (e.g. Supabase Table Editor) show up within the hour.
  cacheLife("hours");
  return {
    products: (productsRes.data ?? []).map(toProduct),
    categories: (categoriesRes.data ?? []).map(toCategory),
  };
}

export async function getProduct(id: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.id === id);
}

export async function getCategory(slug: string) {
  const { categories } = await getCatalog();
  return categories.find((c) => c.slug === slug);
}
