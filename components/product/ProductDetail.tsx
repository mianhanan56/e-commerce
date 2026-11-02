"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MAX_QTY, useCart } from "@/components/cart/CartContext";
import { Icon, type IconName } from "@/components/ui/Icon";
import { discountPercent, formatPKR, type Category, type Product } from "@/data/catalog";
import styles from "./ProductDetail.module.scss";

const assurances: { icon: IconName; title: string; text: string }[] = [
  { icon: "truck", title: "Free delivery", text: "2–4 days, anywhere in Pakistan" },
  { icon: "cash", title: "Cash on delivery", text: "Pay when it reaches you" },
  { icon: "returns", title: "7-day exchange", text: "Unworn, in original packaging" },
  { icon: "shield", title: "1-year warranty", text: "Movement and manufacturing" },
];

const specLabels: Record<keyof Product["specs"], string> = {
  movement: "Movement",
  caseSize: "Case size",
  caseMaterial: "Case",
  strap: "Strap",
  glass: "Crystal",
  waterResistance: "Water resistance",
};

type Props = { product: Product; category: Category };

export function ProductDetail({ product, category }: Props) {
  const { addToCart, openCart, toggleWishlist, isWishlisted } = useCart();
  const [qty, setQty] = useState(1);
  const saved = isWishlisted(product.id);
  const off = discountPercent(product);

  const onAdd = () => {
    addToCart(product.id, qty);
    openCart();
  };

  // Hover zoom follows the cursor by moving the transform origin.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.media} onMouseMove={onMove}>
        <Image
          src={product.image}
          alt={`${product.name} men's watch, ${product.line}`}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 58vw, 100vw"
          className={styles.image}
        />
        {off > 0 ? (
          <span className={styles.badge}>Save {off}%</span>
        ) : (
          product.isNew && <span className={styles.badge}>New arrival</span>
        )}
      </div>

      <div className={styles.panel}>
        <Link href={`/collections/${category.slug}`} className={styles.eyebrow}>
          {category.name} Collection
        </Link>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.line}>{product.line}</p>

        <p className={styles.price}>
          <span className={off ? styles.sale : undefined}>{formatPKR(product.price)}</span>
          {product.originalPrice && (
            <s className={styles.was}>
              <span className={styles.srOnly}>Was </span>
              {formatPKR(product.originalPrice)}
            </s>
          )}
        </p>
        <p className={styles.note}>Inclusive of all taxes · Free delivery</p>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.buy}>
          <div className={styles.stepper} role="group" aria-label="Quantity">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >
              <Icon name="minus" size={16} />
            </button>
            <output aria-live="polite">{qty}</output>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              disabled={qty >= MAX_QTY}
            >
              <Icon name="plus" size={16} />
            </button>
          </div>

          <button className={styles.add} onClick={onAdd}>
            <Icon name="bag" size={18} /> Add to bag
          </button>

          <button
            className={`${styles.wish} ${saved ? styles.wishOn : ""}`}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.id)}
          >
            <Icon name="heart" size={20} />
          </button>
        </div>

        <ul className={styles.assurances}>
          {assurances.map((a) => (
            <li key={a.title}>
              <Icon name={a.icon} size={22} className={styles.assuranceIcon} />
              <span>
                <strong>{a.title}</strong>
                {a.text}
              </span>
            </li>
          ))}
        </ul>

        <section className={styles.specs} aria-labelledby="specs-title">
          <h2 id="specs-title" className={styles.subhead}>
            Specifications
          </h2>
          <dl>
            {(Object.keys(specLabels) as (keyof Product["specs"])[]).map((k) => (
              <div key={k}>
                <dt>{specLabels[k]}</dt>
                <dd>{product.specs[k]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.accordion}>
          <details>
            <summary>
              Delivery &amp; Returns <Icon name="chevron" size={18} />
            </summary>
            <p>
              Complimentary, insured delivery to over 120 cities in 2–4 working days. Pay by cash on
              delivery or bank transfer. Changed your mind? Exchange any unworn watch within 7 days
              in its original packaging. <Link href="/help/returns">Read the policy</Link>.
            </p>
          </details>
          <details>
            <summary>
              Warranty <Icon name="chevron" size={18} />
            </summary>
            <p>
              Every WAQT watch carries a 1-year warranty covering the movement and manufacturing
              defects. Keep your warranty card — it arrives in the box.{" "}
              <Link href="/help/warranty">Warranty details</Link>.
            </p>
          </details>
          <details>
            <summary>
              Care <Icon name="chevron" size={18} />
            </summary>
            <p>
              Wipe with a soft dry cloth after wear. Keep leather straps away from water and
              perfume. Avoid pressing the crown or pushers underwater, and have automatic movements
              serviced every 4–5 years.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
