import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategory, getProduct, products, relatedProducts } from "@/data/catalog";
import styles from "./page.module.scss";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = getProduct((await params).id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const category = getCategory(product.category)!;

  return (
    <>
      <div className={styles.top}>
        <Breadcrumbs
          crumbs={[
            { label: "Shop", href: "/shop" },
            { label: category.name, href: `/collections/${category.slug}` },
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
          <ProductGrid products={relatedProducts(product)} />
        </div>
      </section>
    </>
  );
}
