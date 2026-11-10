import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const { added, deleted } = await searchParams;
  const supabase = await createSessionClient();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, line, category, price, original_price, stock, image, active")
      .order("sort_order")
      .order("name"),
    supabase.from("categories").select("slug, name"),
  ]);

  const error = productsRes.error ?? categoriesRes.error;
  const products = productsRes.data ?? [];
  const categoryNames = Object.fromEntries((categoriesRes.data ?? []).map((c) => [c.slug, c.name]));
  const lowStock = products.filter((p) => p.active && p.stock <= 3).length;
  const hidden = products.filter((p) => !p.active).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        subtitle={
          error
            ? undefined
            : `${products.length} watches · ${lowStock} low or sold out${hidden ? ` · ${hidden} hidden` : ""}`
        }
        actions={
          <Link href="/admin/products/new" className={ui.btn}>
            <Icon name="plus" size={16} /> Add watch
          </Link>
        }
      />
      <div className={ui.grid}>
        {typeof added === "string" && (
          <p className={ui.flash} role="status">
            Watch added.{" "}
            <Link href={`/admin/products/${added}`} className={ui.link}>
              Open it
            </Link>{" "}
            to make more changes.
          </p>
        )}
        {typeof deleted === "string" && (
          <p className={ui.flash} role="status">
            Deleted “{deleted}”. Past orders still show it.
          </p>
        )}
        {error ? (
          <p className={ui.notice} role="alert">
            Couldn&apos;t load products: {error.message}
          </p>
        ) : products.length === 0 ? (
          <p className={ui.empty}>
            No watches yet.{" "}
            <Link href="/admin/products/new" className={ui.link}>
              Add the first one
            </Link>
            .
          </p>
        ) : (
          <ProductsTable products={products} categoryNames={categoryNames} />
        )}
      </div>
    </>
  );
}
