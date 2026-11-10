import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/catalog/DeleteButton";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { Icon } from "@/components/ui/Icon";
import { deleteProduct } from "@/lib/actions/catalog";
import { requireAdmin } from "@/lib/admin/auth";
import { SLUG_PATTERN } from "@/lib/admin/catalog-fields";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/catalog/CatalogForm.module.scss";

export const metadata: Metadata = { title: "Edit watch" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!SLUG_PATTERN.test(id)) notFound();

  const supabase = await createSessionClient();
  const [productRes, categoriesRes, ordersRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("slug, name").order("sort_order").order("name"),
    supabase.from("order_items").select("id", { count: "exact", head: true }).eq("product_id", id),
  ]);

  const error = productRes.error ?? categoriesRes.error;
  if (error) {
    return (
      <>
        <AdminPageHeader eyebrow="Catalogue" title="Edit watch" />
        <p className={ui.notice} role="alert">
          Couldn&apos;t load this watch: {error.message}
        </p>
      </>
    );
  }
  const product = productRes.data;
  if (!product) notFound();
  const ordered = ordersRes.count ?? 0;

  return (
    <>
      <Link href="/admin/products" className={styles.back}>
        <Icon name="arrow" size={14} className={styles.backIcon} /> All products
      </Link>
      <AdminPageHeader
        eyebrow="Catalogue"
        title={product.name}
        subtitle={product.active ? "Live in the store" : "Hidden from the store"}
        actions={
          product.active && (
            <a
              href={`/products/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ui.btn} ${ui.btnGhost}`}
            >
              View in store <Icon name="arrow" size={14} />
            </a>
          )
        }
      />
      <div className={ui.grid}>
        <ProductForm product={product} categories={categoriesRes.data ?? []} />

        <section className={`${ui.card} ${styles.danger}`} aria-labelledby="delete-title">
          <h2 id="delete-title" className={ui.cardTitle}>
            Delete watch
          </h2>
          <p>
            {ordered
              ? `This watch is on ${ordered} past order ${ordered === 1 ? "line" : "lines"}. Those orders keep its name, price and photo. `
              : ""}
            To take it off the store for now, untick “Visible in the store” instead.
          </p>
          <DeleteButton
            action={deleteProduct.bind(null, product.id)}
            label="Delete watch"
            confirm={`Delete “${product.name}” permanently? This can't be undone. (To hide it for now, untick “Visible in the store” instead.)`}
          />
        </section>
      </div>
    </>
  );
}
