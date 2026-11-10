import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { collectionHref } from "@/data/catalog";
import type { CategoryRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "../products/ProductsTable.module.scss";

type Collection = Pick<CategoryRow, "slug" | "name" | "image" | "sort_order"> & {
  total: number;
  live: number;
};

export function CollectionsTable({ collections }: { collections: Collection[] }) {
  return (
    <div className={ui.tableWrap}>
      <table className={ui.table}>
        <thead>
          <tr>
            <th>Collection</th>
            <th className={ui.num}>Watches</th>
            <th className={ui.num}>Position</th>
            <th>
              <span className={styles.srOnly}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.slug}>
              <td>
                <div className={styles.watch}>
                  <span className={styles.thumb}>
                    {c.image && (
                      <Image src={c.image} alt="" fill sizes="44px" className={styles.image} />
                    )}
                  </span>
                  <span>
                    <Link href={`/admin/collections/${c.slug}`} className={styles.name}>
                      {c.name}
                    </Link>
                    <span className={styles.id}>/shop/{c.slug}</span>
                  </span>
                </div>
              </td>
              <td className={ui.num}>
                {c.total}
                {c.total > c.live && <span className={styles.was}>{c.total - c.live} hidden</span>}
              </td>
              <td className={ui.num}>{c.sort_order}</td>
              <td>
                <span className={styles.actions}>
                  <Link
                    href={`/admin/collections/${c.slug}`}
                    className={styles.view}
                    aria-label={`Edit ${c.name}`}
                  >
                    Edit
                  </Link>
                  <a
                    href={collectionHref(c.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.view}
                    aria-label={`View ${c.name} in the store`}
                  >
                    View <Icon name="arrow" size={14} />
                  </a>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
