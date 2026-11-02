import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/catalog";
import styles from "./Categories.module.scss";

export function Categories() {
  return (
    <section id="categories" className={styles.section} aria-labelledby="categories-title">
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            id="categories-title"
            eyebrow="Collections"
            title={
              <>
                Shop by <em>Category</em>
              </>
            }
            intro="Five ways to wear time. Find the character that matches yours."
          />
        </Reveal>
      </div>

      <ul className={styles.grid}>
        {categories.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={(i % 3) as 0 | 1 | 2} className={styles.cell}>
            <Link href={`/collections/${c.slug}`} className={styles.card}>
              <Image
                src={c.image}
                alt=""
                fill
                sizes={
                  i === 0 ? "(min-width: 1024px) 50vw, 85vw" : "(min-width: 1024px) 25vw, 85vw"
                }
                className={styles.image}
              />
              <span className={styles.body}>
                <span className={styles.index}>0{i + 1}</span>
                <span className={styles.name}>{c.name} Watches</span>
                <span className={styles.desc}>{c.description}</span>
                <span className={styles.cta}>
                  Shop {c.name} <Icon name="arrow" size={16} />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
