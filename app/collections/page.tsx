import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { categories, formatPKR, productsInCategory } from "@/data/catalog";
import styles from "@/components/collections/Collections.module.scss";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Five ways to wear time — luxury, classic, minimalist, business and sports watches for men.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Collections" }]}
        eyebrow="Five Characters"
        title={
          <>
            The <em>Collections</em>
          </>
        }
        intro="Every watch we sell belongs to one of five families. Find the character that matches yours — or the occasion you're dressing for."
        align="center"
      />

      <ol className={styles.list}>
        {categories.map((c, i) => {
          const items = productsInCategory(c.slug);
          const from = Math.min(...items.map((p) => p.price));
          return (
            <li key={c.slug} className={styles.row}>
              <Reveal className={styles.media}>
                <Link href={`/collections/${c.slug}`} tabIndex={-1} aria-hidden="true">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className={styles.image}
                  />
                </Link>
              </Reveal>

              <Reveal className={styles.body} delay={1}>
                <p className={styles.index}>0{i + 1}</p>
                <p className={styles.meta}>
                  {items.length} pieces · From {formatPKR(from)}
                </p>
                <h2 className={styles.name}>
                  {c.name} <em>Watches</em>
                </h2>
                <p className={styles.story}>{c.story}</p>

                <ul className={styles.thumbs} aria-label={`${c.name} pieces`}>
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.id}`} className={styles.thumb}>
                        <Image src={p.image} alt={p.name} fill sizes="5rem" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <Button href={`/collections/${c.slug}`} variant="outline" withArrow>
                  Explore {c.name}
                </Button>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </>
  );
}
