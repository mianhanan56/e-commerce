import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/catalog";
import styles from "./SignatureCollection.module.scss";

const bestsellers = products.filter((p) => p.bestseller);

export function SignatureCollection() {
  return (
    <section id="collection" className={styles.section} aria-labelledby="collection-title">
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            id="collection-title"
            eyebrow="Best Sellers"
            title={
              <>
                The Signature <em>Collection</em>
              </>
            }
            intro="Eight pieces our clients return to again and again — from a quiet dress watch to a diver built for the deep end of the week."
          />
        </Reveal>

        <ul className={styles.grid}>
          {bestsellers.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>

        <div className={styles.more}>
          <Button href="/shop" variant="outline" withArrow>
            Shop All Watches
          </Button>
        </div>
      </div>
    </section>
  );
}
