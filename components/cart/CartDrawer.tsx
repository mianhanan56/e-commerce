"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import { useBodyLock } from "@/lib/useBodyLock";
import { useCart } from "./CartContext";
import { CartLineItem } from "./CartLineItem";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const { items, count, subtotal, savings, isCartOpen, closeCart } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useBodyLock(isCartOpen, closeCart);

  useEffect(() => {
    if (isCartOpen) closeRef.current?.focus();
  }, [isCartOpen]);

  return (
    <div
      className={`${styles.root} ${isCartOpen ? styles.open : ""}`}
      aria-hidden={!isCartOpen}
      inert={!isCartOpen}
    >
      <div className={styles.scrim} onClick={closeCart} />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className={styles.head}>
          <h2 id="cart-drawer-title" className={styles.title}>
            Your Bag <span>({count})</span>
          </h2>
          <button
            ref={closeRef}
            className={styles.close}
            onClick={closeCart}
            aria-label="Close bag"
          >
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <Icon name="bag" size={40} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Your bag is empty</p>
            <p className={styles.emptyText}>
              Find the watch that matches the way you carry yourself.
            </p>
            <Button href="/shop" variant="dark" withArrow>
              Shop Watches
            </Button>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onNavigate={closeCart} />
              ))}
            </ul>

            <div className={styles.foot}>
              <dl className={styles.totals}>
                {savings > 0 && (
                  <div className={styles.savings}>
                    <dt>You save</dt>
                    <dd>{formatPKR(savings)}</dd>
                  </div>
                )}
                <div>
                  <dt>Delivery</dt>
                  <dd>Free</dd>
                </div>
                <div className={styles.subtotal}>
                  <dt>Subtotal</dt>
                  <dd>{formatPKR(subtotal)}</dd>
                </div>
              </dl>
              <p className={styles.note}>
                <Icon name="cash" size={18} /> Cash on delivery available nationwide
              </p>
              <div className={styles.actions} onClick={closeCart}>
                <Button href="/checkout" variant="dark" block withArrow>
                  Checkout
                </Button>
                <Button href="/cart" variant="outline" block>
                  View Bag
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
