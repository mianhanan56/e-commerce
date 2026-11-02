"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useOrders, type Order } from "@/components/orders/OrdersContext";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import f from "@/components/ui/Form.module.scss";
import { formatPKR } from "@/data/catalog";
import styles from "./TrackOrder.module.scss";

const stages = [
  { title: "Confirmed", text: "We've received your order and confirmed it with you." },
  { title: "Packed", text: "Inspected by hand, boxed and sealed in our Lahore studio." },
  { title: "Shipped", text: "With our courier partner, insured and on its way." },
  { title: "Delivered", text: "In your hands. Enjoy every minute." },
];

const HOUR = 60 * 60 * 1000;

// Design-phase stand-in for courier tracking: advance the stage with the order's age.
function stageFor(order: Order, now: number) {
  const age = now - new Date(order.date).getTime();
  if (age < 2 * HOUR) return 0;
  if (age < 24 * HOUR) return 1;
  if (age < 72 * HOUR) return 2;
  return 3;
}

const digits = (s: string) => s.replace(/\D/g, "").slice(-10);

type Result = { order: Order; stage: number } | "missing";

export function TrackOrder() {
  const { findOrder } = useOrders();
  const [result, setResult] = useState<Result | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const order = findOrder(String(data.get("number") ?? ""));
    const contact = String(data.get("contact") ?? "")
      .trim()
      .toLowerCase();
    const matches =
      order &&
      (!contact ||
        contact === order.customer.email.toLowerCase() ||
        (digits(contact).length >= 7 && digits(contact) === digits(order.customer.phone)));
    setResult(matches ? { order, stage: stageFor(order, Date.now()) } : "missing");
  };

  return (
    <div className={styles.wrap}>
      <form className={`${f.form} ${styles.form}`} onSubmit={onSubmit}>
        <div className={f.field}>
          <label htmlFor="track-number" className={f.label}>
            Order number
          </label>
          <input
            id="track-number"
            name="number"
            required
            placeholder="WQ-123456"
            autoComplete="off"
            className={f.input}
          />
        </div>
        <div className={f.field}>
          <label htmlFor="track-contact" className={f.label}>
            Phone or email <span className={f.hint}>(optional)</span>
          </label>
          <input
            id="track-contact"
            name="contact"
            placeholder="Used when you placed the order"
            className={f.input}
          />
        </div>
        <Button type="submit" variant="dark" withArrow block>
          Track Order
        </Button>
        <p className={f.hint}>
          While our store is in preview, orders are only stored in this browser.
        </p>
      </form>

      <div className={styles.result} aria-live="polite">
        {result === "missing" && (
          <div className={styles.empty}>
            <Icon name="search" size={28} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>We couldn&apos;t find that order</h2>
            <p className={styles.emptyText}>
              Check the number on your confirmation email or SMS. If it still doesn&apos;t show up,
              our team can look it up for you.
            </p>
            <Button href="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        )}

        {result && result !== "missing" && <OrderStatus {...result} />}

        {!result && (
          <div className={styles.empty}>
            <Icon name="truck" size={28} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Where&apos;s my watch?</h2>
            <p className={styles.emptyText}>
              Most orders arrive in 1–2 working days in major cities and 2–4 days elsewhere. Read
              more about <Link href="/help/shipping">shipping &amp; delivery</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderStatus({ order, stage }: { order: Order; stage: number }) {
  const placed = new Date(order.date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.status}>
      <div className={styles.statusHead}>
        <div>
          <p className={styles.label}>Order {order.number}</p>
          <h2 className={styles.statusTitle}>
            {stages[stage].title === "Delivered" ? (
              "Delivered"
            ) : (
              <>
                Currently <em>{stages[stage].title.toLowerCase()}</em>
              </>
            )}
          </h2>
        </div>
        <p className={styles.placed}>Placed {placed}</p>
      </div>

      <ol className={styles.timeline}>
        {stages.map((s, i) => (
          <li
            key={s.title}
            className={`${styles.stage} ${i <= stage ? styles.done : ""} ${i === stage ? styles.current : ""}`}
            aria-current={i === stage ? "step" : undefined}
          >
            <span className={styles.dot}>{i <= stage && <Icon name="check" size={14} />}</span>
            <div>
              <p className={styles.stageTitle}>{s.title}</p>
              <p className={styles.stageText}>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.thumb}>
              <Image src={item.image} alt="" fill sizes="4rem" className={styles.thumbImage} />
            </div>
            <div className={styles.itemInfo}>
              <Link href={`/products/${item.id}`} className={styles.itemName}>
                {item.name}
              </Link>
              <p className={styles.itemQty}>Qty {item.qty}</p>
            </div>
            <p className={styles.itemPrice}>{formatPKR(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <dl className={styles.summary}>
        <div>
          <dt>Delivery to</dt>
          <dd>
            {order.customer.name}, {order.customer.city}
          </dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>{order.payment === "cod" ? "Cash on delivery" : "Bank transfer"}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd className={styles.total}>{formatPKR(order.subtotal)}</dd>
        </div>
      </dl>
    </div>
  );
}
