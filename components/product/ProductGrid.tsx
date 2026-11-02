import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.scss";

export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  return (
    <ul className={`${styles.grid} ${columns === 3 ? styles.three : ""}`}>
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % columns) as 0 | 1 | 2 | 3}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </ul>
  );
}
