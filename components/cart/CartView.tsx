"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useCart } from "./CartContext";
import { CartLineItem } from "./CartLineItem";
import { OrderSummary } from "./OrderSummary";
import styles from "./CartView.module.scss";

const assurances: { icon: IconName; text: string }[] = [
  { icon: "truck", text: "Free delivery in 2–4 working days" },
  { icon: "cash", text: "Pay with cash when it arrives" },
  { icon: "returns", text: "7-day exchange on every watch" },
  { icon: "shield", text: "1-year movement warranty" },
];

export function CartView() {
  const { items, subtotal, savings, hydrated, clearCart } = useCart();

  if (!hydrated) return <LoadingState />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon="bag"
        title="Your bag is empty"
        text="Nothing here yet. Start with our best sellers or browse by collection."
        action={{ label: "Shop Watches", href: "/shop" }}
      />
    );
  }

  return (
    <div className={styles.layout}>
      <section aria-label="Items in your bag">
        <ul className={styles.lines}>
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </ul>
        <div className={styles.lineActions}>
          <Button href="/shop" variant="outline">
            Continue Shopping
          </Button>
          <button className={styles.clear} onClick={clearCart}>
            <Icon name="trash" size={16} /> Clear bag
          </button>
        </div>
      </section>

      <aside className={styles.summary} aria-labelledby="summary-title">
        <h2 id="summary-title" className={styles.summaryTitle}>
          Order Summary
        </h2>
        <OrderSummary subtotal={subtotal} savings={savings} />
        <Button href="/checkout" variant="dark" block withArrow>
          Proceed to Checkout
        </Button>
        <ul className={styles.assurances}>
          {assurances.map((a) => (
            <li key={a.text}>
              <Icon name={a.icon} size={20} />
              {a.text}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
