"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import f from "@/components/ui/Form.module.scss";
import { formatPKR } from "@/data/catalog";
import { trackOrder } from "@/lib/actions/store";
import { formatDate, formatDateTime, PAYMENT_METHOD_LABEL } from "@/lib/orders";
import type { OrderStatus, TrackedOrder } from "@/lib/supabase/types";
import styles from "./TrackOrder.module.scss";

const stages: { status: OrderStatus; title: string; text: string }[] = [
  {
    status: "pending",
    title: "Placed",
    text: "We've received your order and will call to confirm.",
  },
  { status: "confirmed", title: "Confirmed", text: "Confirmed with you and queued for packing." },
  {
    status: "packed",
    title: "Packed",
    text: "Inspected by hand, boxed and sealed in our Lahore studio.",
  },
  {
    status: "shipped",
    title: "Shipped",
    text: "With our courier partner, insured and on its way.",
  },
  { status: "delivered", title: "Delivered", text: "In your hands. Enjoy every minute." },
];

type Result = { ok: true; order: TrackedOrder } | { ok: false; error: string };

export function TrackOrder() {
  const [result, setResult] = useState<Result | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const number = String(data.get("number") ?? "");
    const contact = String(data.get("contact") ?? "");
    startTransition(async () => setResult(await trackOrder(number, contact)));
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
            placeholder="ZV-123456"
            autoComplete="off"
            className={f.input}
          />
        </div>
        <div className={f.field}>
          <label htmlFor="track-contact" className={f.label}>
            Phone or email
          </label>
          <input
            id="track-contact"
            name="contact"
            required
            placeholder="The one you used at checkout"
            className={f.input}
          />
        </div>
        <Button type="submit" variant="dark" withArrow={!pending} block disabled={pending}>
          {pending ? "Looking it up…" : "Track Order"}
        </Button>
      </form>

      <div className={styles.result} aria-live="polite">
        {result && !result.ok && (
          <div className={styles.empty}>
            <Icon name="search" size={28} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>We couldn&apos;t find that order</h2>
            <p className={styles.emptyText}>
              {result.error} If it still doesn&apos;t show up, our team can look it up for you.
            </p>
            <Button href="/contact" variant="outline">
              Contact Us
            </Button>
          </div>
        )}

        {result?.ok && <OrderStatus order={result.order} />}

        {!result && (
          <div className={styles.empty}>
            <Icon name="truck" size={28} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Where&apos;s my watch?</h2>
            <p className={styles.emptyText}>
              Orders arrive within 5–7 working days, anywhere in Pakistan. Read more about{" "}
              <Link href="/help/shipping">shipping &amp; delivery</Link>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderStatus({ order }: { order: TrackedOrder }) {
  const closed = order.status === "cancelled" || order.status === "returned";
  const stage = stages.findIndex((s) => s.status === order.status);
  const reachedAt = (status: OrderStatus) =>
    order.events.findLast((e) => e.status === status)?.created_at;
  const current = stages[stage];

  return (
    <div className={styles.status}>
      <div className={styles.statusHead}>
        <div>
          <p className={styles.label}>Order {order.order_number}</p>
          <h2 className={styles.statusTitle}>
            {closed ? (
              <>
                Order <em>{order.status}</em>
              </>
            ) : current.status === "delivered" ? (
              "Delivered"
            ) : (
              <>
                Currently <em>{current.title.toLowerCase()}</em>
              </>
            )}
          </h2>
        </div>
        <p className={styles.placed}>Placed {formatDate(order.created_at)}</p>
      </div>

      {closed ? (
        <p className={styles.closed}>
          {order.status === "cancelled"
            ? "This order was cancelled. If that's unexpected, please contact us and we'll help."
            : "This order was returned to us. Our team will be in touch about your exchange or refund."}
        </p>
      ) : (
        <ol className={styles.timeline}>
          {stages.map((s, i) => {
            const at = i <= stage ? reachedAt(s.status) : undefined;
            return (
              <li
                key={s.status}
                className={`${styles.stage} ${i <= stage ? styles.done : ""} ${i === stage ? styles.current : ""}`}
                aria-current={i === stage ? "step" : undefined}
              >
                <span className={styles.dot}>{i <= stage && <Icon name="check" size={14} />}</span>
                <div>
                  <p className={styles.stageTitle}>{s.title}</p>
                  <p className={styles.stageText}>
                    {at ? formatDateTime(at) : s.text}
                    {s.status === "shipped" && i <= stage && order.tracking_number && (
                      <>
                        {" "}
                        · {order.courier ?? "Courier"} tracking{" "}
                        <strong>{order.tracking_number}</strong>
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ul className={styles.items}>
        {order.items.map((item, i) => (
          <li key={`${item.product_id}-${i}`} className={styles.item}>
            <div className={styles.thumb}>
              {item.image && (
                <Image src={item.image} alt="" fill sizes="4rem" className={styles.thumbImage} />
              )}
            </div>
            <div className={styles.itemInfo}>
              {item.product_id ? (
                <Link href={`/products/${item.product_id}`} className={styles.itemName}>
                  {item.name}
                </Link>
              ) : (
                <span className={styles.itemName}>{item.name}</span>
              )}
              <p className={styles.itemQty}>Qty {item.qty}</p>
            </div>
            <p className={styles.itemPrice}>{formatPKR(item.unit_price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <dl className={styles.summary}>
        <div>
          <dt>Delivery to</dt>
          <dd>{order.city}</dd>
        </div>
        <div>
          <dt>Payment</dt>
          <dd>
            {PAYMENT_METHOD_LABEL[order.payment_method]}
            {order.payment_status === "paid" && " · Paid"}
          </dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd className={styles.total}>{formatPKR(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
