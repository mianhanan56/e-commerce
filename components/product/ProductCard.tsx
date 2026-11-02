"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { Icon } from "@/components/ui/Icon";
import { discountPercent, formatPKR, type Product } from "@/data/catalog";
import styles from "./ProductCard.module.scss";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [added, setAdded] = useState(false);
  const saved = isWishlisted(product.id);
  const off = discountPercent(product);
  const href = `/products/${product.id}`;

  const onAdd = () => {
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <Link href={href} className={styles.imageLink} aria-label={product.name}>
          <Image
            src={product.image}
            alt={`${product.name} men's watch`}
            fill
            sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 50vw"
            className={styles.image}
          />
        </Link>

        {off > 0 ? (
          <span className={styles.badge}>−{off}%</span>
        ) : (
          product.isNew && <span className={styles.badge}>New</span>
        )}

        <button
          className={`${styles.wish} ${saved ? styles.wishOn : ""}`}
          aria-label={
            saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
        >
          <Icon name="heart" size={20} />
        </button>

        <button className={styles.add} onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
          <Icon name={added ? "bag" : "plus"} size={18} />
          <span>{added ? "Added to bag" : "Add to bag"}</span>
        </button>
      </div>

      <div className={styles.info}>
        <div>
          <h3 className={styles.name}>
            <Link href={href}>{product.name}</Link>
          </h3>
          <p className={styles.line}>{product.line}</p>
        </div>
        <p className={styles.price}>
          <span className={off ? styles.sale : undefined}>{formatPKR(product.price)}</span>
          {product.originalPrice && (
            <s className={styles.was}>
              <span className={styles.srOnly}>Was </span>
              {formatPKR(product.originalPrice)}
            </s>
          )}
        </p>
      </div>
    </article>
  );
}
