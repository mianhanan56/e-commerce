import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";
import styles from "@/components/shop/ShopView.module.scss";
import { PageHeader } from "@/components/ui/PageHeader";
import { productsInCategory } from "@/data/catalog";
import { getCatalog } from "@/lib/catalog";
import { collectionJsonLd, pageMetadata } from "@/lib/seo";

// One indexable page per category (/shop/luxury, /shop/sports…). Visitors get the same shop
// as /shop with this category selected; search engines get a page with its own title, intro
// and copy, which the old /shop?category= filter could never provide.

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  // Cache Components needs at least one param; a placeholder renders the 404.
  return categories.length ? categories.map((c) => ({ category: c.slug })) : [{ category: "none" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const { categories } = await getCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} Watches for Men`,
    description: `${category.description} Shop Zarvonique ${category.name.toLowerCase()} watches for men with free delivery across Pakistan and cash on delivery.`,
    path: `/shop/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const { products, categories } = await getCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <JsonLd data={collectionJsonLd(category, productsInCategory(products, category.slug))} />
      <PageHeader
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
        eyebrow="Men's Watches"
        title={
          <>
            {category.name} <em>Watches</em>
          </>
        }
        intro={category.description}
      />
      <Suspense fallback={<ShopFallback category={category.slug} />}>
        <ShopView category={category.slug} />
      </Suspense>
      {category.story && (
        <section className={styles.story} aria-labelledby="category-story-title">
          <div className={styles.storyInner}>
            <p className={styles.storyEyebrow}>Why {category.name.toLowerCase()}</p>
            <h2 id="category-story-title" className={styles.storyTitle}>
              About our <em>{category.name.toLowerCase()}</em> watches
            </h2>
            <p className={styles.storyText}>{category.story}</p>
          </div>
        </section>
      )}
    </>
  );
}
