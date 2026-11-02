import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, formatPKR, getCategory, productsInCategory } from "@/data/catalog";
import styles from "@/components/collections/Collections.module.scss";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return {};
  return { title: `${category.name} Watches`, description: category.story };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const category = getCategory((await params).slug);
  if (!category) notFound();

  const items = productsInCategory(category.slug);
  const from = Math.min(...items.map((p) => p.price));
  const index = categories.indexOf(category) + 1;
  const others = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <section className={styles.hero} aria-labelledby="collection-title">
        <div className={styles.heroText}>
          <Breadcrumbs
            crumbs={[{ label: "Collections", href: "/collections" }, { label: category.name }]}
          />
          <p className={styles.heroEyebrow}>Collection 0{index}</p>
          <h1 id="collection-title" className={styles.heroTitle}>
            {category.name} <em>Watches</em>
          </h1>
          <p className={styles.heroStory}>{category.story}</p>
          <dl className={styles.stats}>
            <div>
              <dt>Pieces</dt>
              <dd>{items.length}</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>{formatPKR(from)}</dd>
            </div>
          </dl>
        </div>
        <div className={styles.heroMedia}>
          <Image
            src={category.image}
            alt={`${category.name} watch`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      <section className={styles.products} aria-labelledby="pieces-title">
        <Reveal>
          <SectionHeading
            id="pieces-title"
            eyebrow={`${items.length} pieces`}
            title={
              <>
                The {category.name} <em>Edit</em>
              </>
            }
            intro={category.description}
          />
        </Reveal>
        <ProductGrid products={items} columns={3} />
      </section>

      <section className={styles.others} aria-labelledby="others-title">
        <div className={styles.othersInner}>
          <Reveal>
            <SectionHeading
              id="others-title"
              eyebrow="Keep Exploring"
              title={
                <>
                  Other <em>Collections</em>
                </>
              }
              tone="light"
            />
          </Reveal>
          <ul className={styles.otherGrid}>
            {others.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i as 0 | 1 | 2 | 3}>
                <Link href={`/collections/${c.slug}`} className={styles.otherCard}>
                  <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" />
                  <span className={styles.otherBody}>
                    <span className={styles.otherName}>{c.name}</span>
                    <span className={styles.otherCta}>
                      Explore <Icon name="arrow" size={16} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
