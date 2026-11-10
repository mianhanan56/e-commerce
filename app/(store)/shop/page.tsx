import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopView } from "@/components/shop/ShopView";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCatalog } from "@/lib/catalog";
import styles from "@/components/shop/ShopView.module.scss";

export const metadata: Metadata = {
  title: "Shop All Watches",
  description:
    "Every Zarvonique watch in one place. Free delivery across Pakistan, cash on delivery.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Shop" }]}
        eyebrow="The Full Range"
        title={
          <>
            Shop All <em>Watches</em>
          </>
        }
        intro="Every piece chosen by hand. Filter by character, sort by price, or search for exactly what you have in mind."
      />
      {/* Filters read the URL, so the unfiltered range is the prerendered fallback. */}
      <Suspense fallback={<ShopFallback />}>
        <ShopView />
      </Suspense>
    </>
  );
}

async function ShopFallback() {
  const { products } = await getCatalog();
  return (
    <section className={styles.section} aria-label="Watches">
      <div className={styles.inner}>
        <div className={styles.toolbar} />
        <div className={styles.bar}>
          <p className={styles.count}>{products.length} watches</p>
        </div>
        <ProductGrid products={products} eager={4} />
      </div>
    </section>
  );
}
