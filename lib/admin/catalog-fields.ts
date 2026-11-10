import type { Product } from "@/data/catalog";

// Shared by the admin catalogue forms (client) and lib/actions/catalog.ts (server).

// Product ids and collection slugs are URL segments: /products/<id>, /shop/<slug>.
// Same rule as the database check constraint; "new" is taken by the admin's add pages.
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RESERVED_SLUGS = ["new"];

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

export const SPEC_FIELDS: { key: keyof Product["specs"]; label: string; placeholder: string }[] = [
  { key: "movement", label: "Movement", placeholder: "Automatic, 42-hour reserve" },
  { key: "caseSize", label: "Case size", placeholder: "40mm × 11.8mm" },
  { key: "caseMaterial", label: "Case", placeholder: "316L stainless steel" },
  { key: "strap", label: "Strap", placeholder: "Steel bracelet, butterfly clasp" },
  { key: "glass", label: "Crystal", placeholder: "Sapphire crystal" },
  { key: "waterResistance", label: "Water resistance", placeholder: "100m" },
];

// Matches the "catalog" storage bucket (supabase/migrations/20261103120000_catalog_images.sql).
// Vercel caps request bodies at 4.5 MB, so this can't go much higher.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function imageFileError(file: File) {
  if (!(file.type in IMAGE_TYPES)) return "Use a JPG, PNG, WebP or AVIF photo.";
  if (file.size > MAX_IMAGE_BYTES) return "That photo is over 4 MB. Please use a smaller one.";
  return null;
}
