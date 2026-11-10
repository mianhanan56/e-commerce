import { ProductGrid } from "@/components/product/ProductGrid";
import { getCatalog } from "@/lib/catalog";
import styles from "./ShopView.module.scss";

// The prerendered shop grid, shown until the client ShopView (which reads the query string)
// takes over. It is also what crawlers index, so it lists the real products for the page.
export async function ShopFallback({ category }: { category?: string }) {
  const { products } = await getCatalog();
  const list = category ? products.filter((p) => p.category === category) : products;
  return (
    <section className={styles.section} aria-label="Watches">
      <div className={styles.inner}>
        <div className={styles.toolbar} />
        <div className={styles.bar}>
          <p className={styles.count}>
            {list.length} {list.length === 1 ? "watch" : "watches"}
          </p>
        </div>
        <ProductGrid products={list} eager={4} />
      </div>
    </section>
  );
}
