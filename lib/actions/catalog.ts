"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  IMAGE_TYPES,
  imageFileError,
  RESERVED_SLUGS,
  SLUG_PATTERN,
  SPEC_FIELDS,
} from "@/lib/admin/catalog-fields";
import { CATALOG_TAG } from "@/lib/catalog";
import { supabaseUrl } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type CatalogResult = { ok: true; image: string } | { ok: false; error: string };

type Supabase = Awaited<ReturnType<typeof createSessionClient>>;
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];

const BUCKET = "catalog";
const fail = (error: string) => ({ ok: false, error }) as const;

const text = (fd: FormData, key: string, max: number) =>
  String(fd.get(key) ?? "")
    .trim()
    .slice(0, max);

// Whole rupees / units: accepts "38,500"; null when blank, NaN when not a whole number.
function whole(fd: FormData, key: string) {
  const raw = text(fd, key, 20).replace(/[,\s]/g, "");
  if (!raw) return null;
  return /^\d+$/.test(raw) ? Number(raw) : NaN;
}

const checked = (fd: FormData, key: string) => fd.get(key) === "on";

// next/image only loads hosts listed in next.config.ts, so only accept the bundled photos
// and uploads in our own bucket; anything else would break the store page.
function isAllowedImage(url: string) {
  return (
    /^\/images\/[\w.-]+$/.test(url) ||
    (!!supabaseUrl && url.startsWith(`${supabaseUrl}/storage/v1/object/public/${BUCKET}/`))
  );
}

function checkSlug(slug: string, what: string) {
  if (!slug) return `Enter a ${what}.`;
  if (!SLUG_PATTERN.test(slug) || slug.length > 60) {
    return `The ${what} can only use lowercase letters, numbers and single dashes.`;
  }
  if (RESERVED_SLUGS.includes(slug)) return `“${slug}” is reserved. Choose another ${what}.`;
  return null;
}

// Uploads the chosen photo (if any) and returns the image URL to save.
async function resolveImage(
  supabase: Supabase,
  fd: FormData,
  folder: "products" | "collections",
  slug: string,
): Promise<{ image: string } | { error: string }> {
  const file = fd.get("image_file");
  if (file instanceof File && file.size > 0) {
    const problem = imageFileError(file);
    if (problem) return { error: problem };

    // A fresh name per upload: old orders keep pointing at the photo they were placed with,
    // and browsers/CDNs never serve a stale copy.
    const path = `${folder}/${slug}-${Date.now().toString(36)}.${IMAGE_TYPES[file.type]}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) {
      if (/bucket not found/i.test(error.message)) {
        return {
          error:
            "Photo storage isn't set up yet. Run supabase/migrations/20261103120000_catalog_images.sql in the Supabase SQL Editor.",
        };
      }
      console.error("image upload failed", error);
      return { error: "Couldn't upload the photo. Please try again." };
    }
    return { image: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
  }

  const image = text(fd, "image", 500);
  if (!image) return { error: "Add a photo." };
  if (!isAllowedImage(image)) return { error: "Upload the photo again." };
  return { image };
}

// New items go to the end of the list unless a position is given.
async function nextPosition(supabase: Supabase, table: "products" | "categories") {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? -1) + 1;
}

export async function saveProduct(fd: FormData): Promise<CatalogResult> {
  await requireAdmin();
  const creating = fd.get("mode") === "create";

  const id = text(fd, "id", 80);
  const name = text(fd, "name", 120);
  const category = text(fd, "category", 80);
  const price = whole(fd, "price");
  const originalPrice = whole(fd, "original_price");
  const stock = whole(fd, "stock");
  const position = whole(fd, "sort_order");

  const slugError = checkSlug(id, "product ID");
  if (slugError) return fail(slugError);
  if (name.length < 2) return fail("Enter the watch name.");
  if (!category) return fail("Choose a collection.");
  if (price === null || Number.isNaN(price) || price < 1 || price > 10_000_000) {
    return fail("Enter the price in whole rupees, e.g. 38500.");
  }
  if (originalPrice !== null) {
    if (Number.isNaN(originalPrice)) return fail("Enter the original price in whole rupees.");
    if (originalPrice <= price) {
      return fail("The original price must be higher than the price (or leave it empty).");
    }
  }
  if (stock === null || Number.isNaN(stock) || stock > 100_000) {
    return fail("Enter how many are in stock (0 or more).");
  }
  if (position !== null && (Number.isNaN(position) || position > 100_000)) {
    return fail("Position must be a whole number.");
  }

  const supabase = await createSessionClient();
  const img = await resolveImage(supabase, fd, "products", id);
  if ("error" in img) return fail(img.error);

  const fields: Omit<ProductInsert, "id"> = {
    name,
    category,
    price,
    original_price: originalPrice,
    stock,
    line: text(fd, "line", 120),
    description: text(fd, "description", 3000),
    image: img.image,
    specs: Object.fromEntries(SPEC_FIELDS.map((f) => [f.key, text(fd, `spec_${f.key}`, 120)])),
    is_new: checked(fd, "is_new"),
    bestseller: checked(fd, "bestseller"),
    active: checked(fd, "active"),
    sort_order: position ?? (creating ? await nextPosition(supabase, "products") : undefined),
  };

  if (creating) {
    const { error } = await supabase.from("products").insert({ id, ...fields });
    if (error) {
      if (error.code === "23505") return fail(`A watch with the ID “${id}” already exists.`);
      if (error.code === "23503") return fail("That collection doesn't exist any more.");
      console.error("insert product failed", error);
      return fail("Couldn't save the watch. Please try again.");
    }
    updateTag(CATALOG_TAG);
    redirect(`/admin/products?added=${encodeURIComponent(id)}`);
  }

  // The id is the product's URL and is referenced by past orders, so it never changes.
  const { data, error } = await supabase.from("products").update(fields).eq("id", id).select("id");
  if (error) {
    if (error.code === "23503") return fail("That collection doesn't exist any more.");
    console.error("update product failed", error);
    return fail("Couldn't save the watch. Please try again.");
  }
  if (!data?.length) return fail("This watch no longer exists.");

  updateTag(CATALOG_TAG);
  refresh();
  return { ok: true, image: img.image };
}

export async function deleteProduct(id: string): Promise<CatalogResult> {
  await requireAdmin();
  if (!SLUG_PATTERN.test(id)) return fail("Unknown watch.");

  // Past orders keep their own copy of name, price and photo (order_items.product_id is
  // set to null), so deleting never changes order history.
  const supabase = await createSessionClient();
  const { data, error } = await supabase.from("products").delete().eq("id", id).select("id");
  if (error) {
    console.error("delete product failed", error);
    return fail("Couldn't delete the watch. Please try again.");
  }
  if (!data?.length) return fail("This watch no longer exists.");

  updateTag(CATALOG_TAG);
  redirect(`/admin/products?deleted=${encodeURIComponent(id)}`);
}

export async function saveCategory(fd: FormData): Promise<CatalogResult> {
  await requireAdmin();
  const creating = fd.get("mode") === "create";

  const slug = text(fd, "slug", 80);
  const name = text(fd, "name", 80);
  const position = whole(fd, "sort_order");

  const slugError = checkSlug(slug, "collection URL");
  if (slugError) return fail(slugError);
  if (name.length < 2) return fail("Enter the collection name.");
  if (position !== null && (Number.isNaN(position) || position > 100_000)) {
    return fail("Position must be a whole number.");
  }

  const supabase = await createSessionClient();
  const img = await resolveImage(supabase, fd, "collections", slug);
  if ("error" in img) return fail(img.error);

  const fields: Omit<CategoryInsert, "slug"> = {
    name,
    description: text(fd, "description", 300),
    story: text(fd, "story", 2000),
    image: img.image,
    sort_order: position ?? (creating ? await nextPosition(supabase, "categories") : undefined),
  };

  if (creating) {
    const { error } = await supabase.from("categories").insert({ slug, ...fields });
    if (error) {
      if (error.code === "23505")
        return fail(`A collection with the URL “${slug}” already exists.`);
      console.error("insert category failed", error);
      return fail("Couldn't save the collection. Please try again.");
    }
    updateTag(CATALOG_TAG);
    redirect(`/admin/collections?added=${encodeURIComponent(slug)}`);
  }

  // The slug is the collection's URL, so it stays fixed like product ids.
  const { data, error } = await supabase
    .from("categories")
    .update(fields)
    .eq("slug", slug)
    .select("slug");
  if (error) {
    console.error("update category failed", error);
    return fail("Couldn't save the collection. Please try again.");
  }
  if (!data?.length) return fail("This collection no longer exists.");

  updateTag(CATALOG_TAG);
  refresh();
  return { ok: true, image: img.image };
}

export async function deleteCategory(slug: string): Promise<CatalogResult> {
  await requireAdmin();
  if (!SLUG_PATTERN.test(slug)) return fail("Unknown collection.");

  const supabase = await createSessionClient();
  // Hidden watches count too: the database won't orphan a product.
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", slug);
  if (count) {
    return fail(
      `This collection still has ${count} ${count === 1 ? "watch" : "watches"}. Move ${count === 1 ? "it" : "them"} to another collection or delete ${count === 1 ? "it" : "them"} first.`,
    );
  }

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("slug", slug)
    .select("slug");
  if (error) {
    if (error.code === "23503") return fail("Move this collection's watches somewhere else first.");
    console.error("delete category failed", error);
    return fail("Couldn't delete the collection. Please try again.");
  }
  if (!data?.length) return fail("This collection no longer exists.");

  updateTag(CATALOG_TAG);
  redirect(`/admin/collections?deleted=${encodeURIComponent(slug)}`);
}
