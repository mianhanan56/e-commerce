"use client";

import { useCart } from "@/components/cart/CartContext";
import { useCatalog } from "@/components/catalog/CatalogContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";
import styles from "./WishlistView.module.scss";

export function WishlistView() {
  const { wishlist, hydrated } = useCart();
  const { products } = useCatalog();

  if (!hydrated) return <LoadingState />;

  const saved = products.filter((p) => wishlist.includes(p.id));
  if (saved.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="No saved watches yet"
        text="Tap the heart on any watch to keep it here for later."
        action={{ label: "Browse Watches", href: "/shop" }}
      />
    );
  }

  return (
    <div className={styles.grid}>
      <ProductGrid products={saved} />
    </div>
  );
}
