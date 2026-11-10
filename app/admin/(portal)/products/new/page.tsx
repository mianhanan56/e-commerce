import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/catalog/CatalogForm.module.scss";

export const metadata: Metadata = { title: "Add watch" };

export default async function NewProductPage({ searchParams }: PageProps<"/admin/products/new">) {
  await requireAdmin();
  const { collection } = await searchParams;
  const supabase = await createSessionClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("slug, name")
    .order("sort_order")
    .order("name");

  return (
    <>
      <Link href="/admin/products" className={styles.back}>
        <Icon name="arrow" size={14} className={styles.backIcon} /> All products
      </Link>
      <AdminPageHeader eyebrow="Catalogue" title="Add a watch" />
      {error ? (
        <p className={ui.notice} role="alert">
          Couldn&apos;t load collections: {error.message}
        </p>
      ) : !categories?.length ? (
        <p className={ui.notice}>
          Every watch belongs to a collection.{" "}
          <Link href="/admin/collections/new" className={ui.link}>
            Create a collection
          </Link>{" "}
          first.
        </p>
      ) : (
        <ProductForm
          categories={categories}
          defaultCategory={typeof collection === "string" ? collection : undefined}
        />
      )}
    </>
  );
}
