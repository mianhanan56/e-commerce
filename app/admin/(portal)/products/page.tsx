import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, line, category, price, original_price, stock, image, active")
    .order("sort_order")
    .order("name");

  const products = data ?? [];
  const lowStock = products.filter((p) => p.active && p.stock <= 3).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        subtitle={error ? undefined : `${products.length} watches · ${lowStock} low or sold out`}
      />
      <div className={ui.grid}>
        <p className={ui.notice}>
          Editing products, prices and stock from here is the next phase. For now, change them in
          Supabase → Table Editor → products.
        </p>
        {error ? (
          <p className={ui.notice} role="alert">
            Couldn&apos;t load products: {error.message}
          </p>
        ) : products.length === 0 ? (
          <p className={ui.empty}>No products yet. Run supabase/seed.sql to load the catalogue.</p>
        ) : (
          <ProductsTable products={products} />
        )}
      </div>
    </>
  );
}
