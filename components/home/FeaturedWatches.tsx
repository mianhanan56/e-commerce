import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { getCatalog } from "@/lib/catalog";
import styles from "./FeaturedWatches.module.scss";

// The first watches of the shop, in the shop's default ("Featured") order.
const SHOWN = 8;

export async function FeaturedWatches() {
  const { products } = await getCatalog();
  const watches = products.slice(0, SHOWN);
  if (watches.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="watches-title">
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            id="watches-title"
            eyebrow="Shop"
            title={
              <>
                Our <em>Watches</em>
              </>
            }
            intro="Men's watches chosen for character and built to last, delivered free across Pakistan with cash on delivery."
          />
        </Reveal>

        <ul className={styles.grid}>
          {watches.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>

        <div className={styles.more}>
          <Button href="/shop" variant="outline" withArrow>
            View All Watches
          </Button>
        </div>
      </div>
    </section>
  );
}
