"use client";

import { useState, useTransition } from "react";
import { updateOrder, type ActionResult, type OrderPatch } from "@/lib/actions/admin";
import { COURIERS, ORDER_STATUSES, PAYMENT_STATUS_LABEL } from "@/lib/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "./OrderDetail.module.scss";

function useOrderUpdate(orderId: string) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const run = (patch: OrderPatch) =>
    startTransition(async () => {
      setResult(await updateOrder(orderId, patch));
    });

  return { pending, result, run };
}

function Feedback({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return result.ok ? (
    <p className={ui.success} role="status">
      Saved.
    </p>
  ) : (
    <p className={ui.error} role="alert">
      {result.error}
    </p>
  );
}

export function StatusForm({
  orderId,
  orderNumber,
  status,
}: {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
}) {
  const { pending, result, run } = useOrderUpdate(orderId);
  const [value, setValue] = useState<OrderStatus>(status);
  const description = ORDER_STATUSES.find((s) => s.value === value)?.description;

  if (status === "cancelled") {
    return (
      <p className={ui.muted}>
        This order is cancelled and its stock has been returned. Cancelled orders can&apos;t be
        reopened.
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      value === "cancelled" &&
      !window.confirm(
        `Cancel order ${orderNumber}? Its watches go back into stock, and a cancelled order can't be reopened.`,
      )
    ) {
      return;
    }
    run({ status: value });
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <label htmlFor="order-status" className={ui.label}>
        Order status
      </label>
      <div className={styles.inline}>
        <select
          id="order-status"
          value={value}
          onChange={(e) => setValue(e.target.value as OrderStatus)}
          className={ui.select}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className={ui.btn} disabled={pending || value === status}>
          {pending ? "Saving…" : "Update"}
        </button>
      </div>
      {description && <p className={styles.hint}>{description}</p>}
      <Feedback result={result} />
    </form>
  );
}

export function PaymentForm({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: PaymentStatus;
}) {
  const { pending, result, run } = useOrderUpdate(orderId);
  const [value, setValue] = useState<PaymentStatus>(paymentStatus);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run({ payment_status: value });
      }}
      className={styles.form}
    >
      <label htmlFor="order-payment" className={ui.label}>
        Payment status
      </label>
      <div className={styles.inline}>
        <select
          id="order-payment"
          value={value}
          onChange={(e) => setValue(e.target.value as PaymentStatus)}
          className={ui.select}
        >
          {(Object.keys(PAYMENT_STATUS_LABEL) as PaymentStatus[]).map((s) => (
            <option key={s} value={s}>
              {PAYMENT_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button type="submit" className={ui.btn} disabled={pending || value === paymentStatus}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      <Feedback result={result} />
    </form>
  );
}

export function ShippingForm({
  orderId,
  courier,
  trackingNumber,
}: {
  orderId: string;
  courier: string | null;
  trackingNumber: string | null;
}) {
  const { pending, result, run } = useOrderUpdate(orderId);
  const [c, setC] = useState(courier ?? "");
  const [t, setT] = useState(trackingNumber ?? "");
  const unchanged = c === (courier ?? "") && t.trim() === (trackingNumber ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run({ courier: c, tracking_number: t });
      }}
      className={styles.form}
    >
      <div>
        <label htmlFor="order-courier" className={ui.label}>
          Courier
        </label>
        <select
          id="order-courier"
          value={c}
          onChange={(e) => setC(e.target.value)}
          className={ui.select}
        >
          <option value="">Not booked yet</option>
          {COURIERS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="order-tracking" className={ui.label}>
          Tracking number
        </label>
        <input
          id="order-tracking"
          value={t}
          onChange={(e) => setT(e.target.value)}
          maxLength={60}
          className={ui.input}
          autoComplete="off"
        />
      </div>
      <button type="submit" className={ui.btn} disabled={pending || unchanged}>
        {pending ? "Saving…" : "Save shipping"}
      </button>
      <Feedback result={result} />
    </form>
  );
}

export function NotesForm({ orderId, notes }: { orderId: string; notes: string | null }) {
  const { pending, result, run } = useOrderUpdate(orderId);
  const [value, setValue] = useState(notes ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run({ internal_notes: value });
      }}
      className={styles.form}
    >
      <label htmlFor="order-notes" className={ui.label}>
        Internal notes <span className={styles.hint}>· only visible to staff</span>
      </label>
      <textarea
        id="order-notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={2000}
        placeholder="Call outcomes, special requests, gift wrapping…"
        className={ui.textarea}
      />
      <div>
        <button
          type="submit"
          className={ui.btn}
          disabled={pending || value.trim() === (notes ?? "")}
        >
          {pending ? "Saving…" : "Save notes"}
        </button>
      </div>
      <Feedback result={result} />
    </form>
  );
}
