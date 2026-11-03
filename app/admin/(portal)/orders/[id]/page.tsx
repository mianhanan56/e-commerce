import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  NotesForm,
  PaymentForm,
  ShippingForm,
  StatusForm,
} from "@/components/admin/orders/OrderForms";
import { PrintButton } from "@/components/admin/orders/PrintButton";
import { PaymentBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import { requireAdmin } from "@/lib/admin/auth";
import {
  formatDateTime,
  formatPhone,
  PAYMENT_METHOD_LABEL,
  statusLabel,
  whatsappLink,
} from "@/lib/orders";
import { createSessionClient } from "@/lib/supabase/server";
import type { OrderEventRow } from "@/lib/supabase/types";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/orders/OrderDetail.module.scss";

export const metadata: Metadata = { title: "Order" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function eventText(e: OrderEventRow) {
  if (e.type === "created") return "Order placed";
  if (e.type === "status" && e.status) return `Status → ${statusLabel(e.status)}`;
  return e.message;
}

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createSessionClient();
  const [orderRes, itemsRes, eventsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id).order("id"),
    supabase
      .from("order_events")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const error = orderRes.error ?? itemsRes.error ?? eventsRes.error;
  if (error) {
    return (
      <>
        <AdminPageHeader eyebrow="Orders" title="Order" />
        <p className={ui.notice} role="alert">
          Couldn&apos;t load this order: {error.message}
        </p>
      </>
    );
  }

  const order = orderRes.data;
  if (!order) notFound();
  const items = itemsRes.data ?? [];
  const events = eventsRes.data ?? [];

  const actorIds = [...new Set(events.map((e) => e.actor).filter((a): a is string => !!a))];
  const { data: actors } = actorIds.length
    ? await supabase.from("admins").select("user_id, name").in("user_id", actorIds)
    : { data: [] as { user_id: string; name: string }[] };
  const actorName = new Map((actors ?? []).map((a) => [a.user_id, a.name]));
  const who = (e: OrderEventRow) =>
    e.actor ? actorName.get(e.actor) || "Admin" : e.type === "created" ? "Customer" : "System";

  const firstName = order.customer_name.split(" ")[0];
  const whatsapp = whatsappLink(
    order.phone,
    `Assalam o Alaikum ${firstName}, this is WAQT confirming your order ${order.order_number} for ${formatPKR(order.total)}, to be delivered to ${order.city}. Please reply YES to confirm.`,
  );
  const itemsTotal = order.subtotal + order.savings;
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className={styles.slip}>
      <Link href="/admin/orders" className={`${styles.back} ${styles.noPrint}`}>
        <Icon name="arrow" size={14} className={styles.backIcon} /> All orders
      </Link>

      <AdminPageHeader
        eyebrow={`Placed ${formatDateTime(order.created_at)}`}
        title={
          <span className={styles.titleRow}>
            {order.order_number}
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.payment_status} />
          </span>
        }
        subtitle={`${count} ${count === 1 ? "watch" : "watches"} · ${formatPKR(order.total)} · ${PAYMENT_METHOD_LABEL[order.payment_method]}`}
        actions={
          <div className={styles.noPrint}>
            <PrintButton />
          </div>
        }
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={ui.card} aria-labelledby="items-title">
            <h2 id="items-title" className={ui.cardTitle}>
              Items
            </h2>
            <table className={styles.items}>
              <thead>
                <tr>
                  <th scope="col">Watch</th>
                  <th scope="col" className={styles.num}>
                    Qty
                  </th>
                  <th scope="col" className={styles.num}>
                    Price
                  </th>
                  <th scope="col" className={styles.num}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <span className={styles.product}>
                        <span className={styles.thumb}>
                          {i.image && (
                            <Image
                              src={i.image}
                              alt=""
                              fill
                              sizes="48px"
                              className={styles.image}
                            />
                          )}
                        </span>
                        <span>
                          {i.product_id ? (
                            <Link href={`/products/${i.product_id}`} className={styles.productName}>
                              {i.name}
                            </Link>
                          ) : (
                            <span className={styles.productName}>{i.name}</span>
                          )}
                          <span className={styles.productLine}>{i.line}</span>
                        </span>
                      </span>
                    </td>
                    <td className={styles.num}>{i.qty}</td>
                    <td className={styles.num}>
                      {formatPKR(i.unit_price)}
                      {i.original_price && (
                        <s className={styles.was}>{formatPKR(i.original_price)}</s>
                      )}
                    </td>
                    <td className={styles.num}>{formatPKR(i.unit_price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl className={styles.totals}>
              <div>
                <dt>Items</dt>
                <dd>{formatPKR(itemsTotal)}</dd>
              </div>
              {order.savings > 0 && (
                <div className={styles.savings}>
                  <dt>Savings</dt>
                  <dd>−{formatPKR(order.savings)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>{order.delivery_fee ? formatPKR(order.delivery_fee) : "Free"}</dd>
              </div>
              <div className={styles.grand}>
                <dt>
                  Total{" "}
                  {order.payment_method === "cod" && order.payment_status === "unpaid" && (
                    <span className={styles.collect}>· collect on delivery</span>
                  )}
                </dt>
                <dd>{formatPKR(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className={`${ui.card} ${styles.noPrint}`} aria-label="Internal notes">
            <NotesForm orderId={order.id} notes={order.internal_notes} />
          </section>

          <section className={`${ui.card} ${styles.noPrint}`} aria-labelledby="timeline-title">
            <h2 id="timeline-title" className={ui.cardTitle}>
              History
            </h2>
            {events.length === 0 ? (
              <p className={ui.muted}>No history recorded.</p>
            ) : (
              <ol className={styles.timeline}>
                {events.map((e) => (
                  <li key={e.id}>
                    <p className={styles.eventText}>{eventText(e)}</p>
                    <p className={styles.eventMeta}>
                      {formatDateTime(e.created_at)} · {who(e)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className={styles.side}>
          <section className={`${ui.card} ${styles.customer}`} aria-labelledby="customer-title">
            <h2 id="customer-title" className={ui.cardTitle}>
              Customer
            </h2>
            <p className={styles.customerName}>{order.customer_name}</p>
            <ul className={styles.contact}>
              <li>
                <a href={`tel:${order.phone}`} className={ui.link}>
                  {formatPhone(order.phone)}
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.whatsapp} ${styles.noPrint}`}
                >
                  <Icon name="whatsapp" size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${order.email}`} className={ui.link}>
                  {order.email}
                </a>
              </li>
            </ul>
            <address className={styles.address}>
              {order.address}
              <br />
              {order.city}
            </address>
            {order.notes && (
              <p className={styles.customerNotes}>
                <span>Customer note</span>
                {order.notes}
              </p>
            )}
          </section>

          <section className={`${ui.card} ${styles.noPrint}`} aria-label="Status">
            <StatusForm orderId={order.id} orderNumber={order.order_number} status={order.status} />
          </section>

          <section className={`${ui.card} ${styles.noPrint}`} aria-label="Payment">
            <p className={styles.method}>{PAYMENT_METHOD_LABEL[order.payment_method]}</p>
            <PaymentForm orderId={order.id} paymentStatus={order.payment_status} />
          </section>

          <section className={`${ui.card} ${styles.noPrint}`} aria-label="Shipping">
            <ShippingForm
              orderId={order.id}
              courier={order.courier}
              trackingNumber={order.tracking_number}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
