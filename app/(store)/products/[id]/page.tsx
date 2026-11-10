import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collectionHref, relatedProducts } from "@/data/catalog";
import { getCatalog, getProduct } from "@/lib/catalog";
import styles from "./page.module.scss";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  // Cache Components needs at least one param; a placeholder renders the 404.
  return products.length ? products.map((p) => ({ id: p.id })) : [{ id: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await getProduct((await params).id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const { products, categories } = await getCatalog();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  // The products → categories foreign key guarantees a match.
  const category = categories.find((c) => c.slug === product.category)!;

  return (
    <>
      <div className={styles.top}>
        <Breadcrumbs
          crumbs={[
            { label: "Shop", href: "/shop" },
            { label: category.name, href: collectionHref(category.slug) },
            { label: product.name },
          ]}
        />
        <ProductDetail product={product} category={category} />
      </div>

      <section className={styles.related} aria-labelledby="related-title">
        <div className={styles.inner}>
          <Reveal>
            <SectionHeading
              id="related-title"
              eyebrow="Keep Looking"
              title={
                <>
                  You May Also <em>Like</em>
                </>
              }
            />
          </Reveal>
          <ProductGrid products={relatedProducts(products, product)} />
        </div>
      </section>
    </>
  );
}
