import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collectionHref, formatPKR, relatedProducts } from "@/data/catalog";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata, productJsonLd } from "@/lib/seo";
import styles from "./page.module.scss";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  // Cache Components needs at least one param; a placeholder renders the 404.
  return products.length ? products.map((p) => ({ id: p.id })) : [{ id: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const { products, categories } = await getCatalog();
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  const category = categories.find((c) => c.slug === product.category);
  return pageMetadata({
    // "Noir Automatic — Men's Classic Watch": the name alone says nothing to a searcher.
    title: `${product.name} — Men's ${category ? `${category.name} ` : ""}Watch`,
    description: `${product.description} ${formatPKR(product.price)}, free delivery across Pakistan, cash on delivery.`,
    path: `/products/${product.id}`,
    image: product.image,
  });
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
      <JsonLd data={productJsonLd(product, category)} />
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
