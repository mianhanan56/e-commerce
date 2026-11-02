"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import { MAX_QTY, useCart, type CartItem } from "./CartContext";
import styles from "./CartLineItem.module.scss";

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const { setQty, removeFromCart } = useCart();
  const { product, qty } = item;
  const href = `/products/${product.id}`;

  return (
    <li className={styles.line}>
      <Link href={href} className={styles.thumb} onClick={onNavigate} tabIndex={-1}>
        <Image src={product.image} alt="" fill sizes="96px" className={styles.image} />
      </Link>

      <div className={styles.body}>
        <div className={styles.top}>
          <div>
            <Link href={href} className={styles.name} onClick={onNavigate}>
              {product.name}
            </Link>
            <p className={styles.meta}>{product.line}</p>
          </div>
          <p className={styles.price}>
            {formatPKR(product.price * qty)}
            {product.originalPrice && (
              <s className={styles.was}>{formatPKR(product.originalPrice * qty)}</s>
            )}
          </p>
        </div>

        <div className={styles.bottom}>
          <div className={styles.stepper} role="group" aria-label={`Quantity of ${product.name}`}>
            <button
              onClick={() => setQty(product.id, qty - 1)}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <Icon name="minus" size={16} />
            </button>
            <span aria-live="polite">{qty}</span>
            <button
              onClick={() => setQty(product.id, qty + 1)}
              disabled={qty >= MAX_QTY}
              aria-label="Increase quantity"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
          <button
            className={styles.remove}
            onClick={() => removeFromCart(product.id)}
            aria-label={`Remove ${product.name} from bag`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
