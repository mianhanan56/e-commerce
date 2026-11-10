import { Suspense } from "react";
import { ShopFallback } from "@/components/shop/ShopFallback";
import { ShopView } from "@/components/shop/ShopView";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop All Men's Watches",
  description:
    "Shop every Zarvonique men's watch: automatic, chronograph, dress, diver and minimalist. Free delivery across Pakistan and cash on delivery.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Shop" }]}
        eyebrow="The Full Range"
        title={
          <>
            Shop All <em>Watches</em>
          </>
        }
        intro="Every piece chosen by hand. Filter by character, sort by price, or search for exactly what you have in mind."
      />
      {/* Filters read the URL, so the unfiltered range is the prerendered fallback. */}
      <Suspense fallback={<ShopFallback />}>
        <ShopView />
      </Suspense>
    </>
  );
}
