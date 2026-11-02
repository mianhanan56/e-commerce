import { Icon } from "@/components/ui/Icon";
import type { HelpBlock } from "@/data/help";
import styles from "./Help.module.scss";

export function HelpContent({ blocks }: { blocks: HelpBlock[] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case "h":
        return (
          <h2 key={i} className={styles.h}>
            {b.text}
          </h2>
        );
      case "p":
        return (
          <p key={i} className={styles.p}>
            {b.text}
          </p>
        );
      case "list":
        return (
          <ul key={i} className={styles.list}>
            {b.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div key={i} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {b.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, j) =>
                      j === 0 ? (
                        <th key={j} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={j}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "faq":
        return <Faq key={i} items={b.items} />;
    }
  });
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className={styles.faq}>
      {items.map((item) => (
        <details key={item.q} className={styles.faqItem}>
          <summary>
            <span>{item.q}</span>
            <Icon name="plus" size={18} className={styles.faqIcon} />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
