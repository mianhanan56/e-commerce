import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import type { ProductRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "./ProductsTable.module.scss";

type Product = Pick<
  ProductRow,
  "id" | "name" | "line" | "category" | "price" | "original_price" | "stock" | "image" | "active"
>;

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <div className={ui.tableWrap}>
      <table className={ui.table}>
        <thead>
          <tr>
            <th>Watch</th>
            <th>Category</th>
            <th className={ui.num}>Price</th>
            <th className={ui.num}>Stock</th>
            <th>Visibility</th>
            <th>
              <span className={styles.srOnly}>Store page</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className={styles.watch}>
                  <span className={styles.thumb}>
                    {p.image && (
                      <Image src={p.image} alt="" fill sizes="44px" className={styles.image} />
                    )}
                  </span>
                  <span>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.id}>{p.id}</span>
                  </span>
                </div>
              </td>
              <td className={styles.category}>{p.category}</td>
              <td className={ui.num}>
                {formatPKR(p.price)}
                {p.original_price && <s className={styles.was}>{formatPKR(p.original_price)}</s>}
              </td>
              <td className={ui.num}>
                <span
                  className={p.stock === 0 ? styles.soldOut : p.stock <= 3 ? styles.low : undefined}
                >
                  {p.stock === 0 ? "Sold out" : p.stock}
                </span>
              </td>
              <td>
                <span className={`${ui.badge} ${p.active ? ui.delivered : ui.cancelled}`}>
                  {p.active ? "Live" : "Hidden"}
                </span>
              </td>
              <td>
                <a
                  href={`/products/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.view}
                  aria-label={`View ${p.name} in the store`}
                >
                  View <Icon name="arrow" size={14} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
