import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import { formatDateTime } from "@/lib/orders";
import type { DashboardStats, OrderRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "./Dashboard.module.scss";

type RecentOrder = Pick<
  OrderRow,
  "id" | "order_number" | "created_at" | "customer_name" | "city" | "total" | "status"
>;

type Stat = { label: string; value: string; sub?: string; href?: string; emphasis?: boolean };

export function Dashboard({ stats, recent }: { stats: DashboardStats; recent: RecentOrder[] }) {
  const cards: Stat[] = [
    {
      label: "Awaiting confirmation",
      value: String(stats.pending),
      sub: stats.pending ? "Call or WhatsApp to confirm" : "All caught up",
      href: "/admin/orders?status=pending",
      emphasis: stats.pending > 0,
    },
    {
      label: "Ready to ship",
      value: String(stats.to_ship),
      sub: "Confirmed or packed",
      href: "/admin/orders?status=confirmed",
    },
    { label: "Orders today", value: String(stats.orders_today), href: "/admin/orders" },
    { label: "Revenue, 7 days", value: formatPKR(stats.revenue_7d), sub: "Excludes cancellations" },
    {
      label: "Revenue, 30 days",
      value: formatPKR(stats.revenue_30d),
      sub: `${stats.orders_30d} ${stats.orders_30d === 1 ? "order" : "orders"}`,
    },
    {
      label: "Unread messages",
      value: String(stats.unhandled_messages),
      href: "/admin/messages",
      emphasis: stats.unhandled_messages > 0,
    },
    { label: "Subscribers", value: String(stats.subscribers), href: "/admin/subscribers" },
  ];

  return (
    <div className={styles.dashboard}>
      <ul className={styles.stats}>
        {cards.map((c) => (
          <li key={c.label}>
            <StatCard {...c} />
          </li>
        ))}
      </ul>

      <div className={styles.columns}>
        <section aria-labelledby="recent-orders">
          <div className={styles.sectionHead}>
            <h2 id="recent-orders" className={ui.cardTitle}>
              Recent orders
            </h2>
            <Link href="/admin/orders" className={styles.more}>
              View all orders <Icon name="arrow" size={14} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className={ui.empty}>
              No orders yet — they&apos;ll appear here as soon as a customer checks out.
            </p>
          ) : (
            <div className={ui.tableWrap}>
              <table className={ui.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Placed</th>
                    <th>Customer</th>
                    <th>City</th>
                    <th className={ui.num}>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/admin/orders/${o.id}`} className={ui.link}>
                          {o.order_number}
                        </Link>
                      </td>
                      <td className={ui.muted}>{formatDateTime(o.created_at)}</td>
                      <td>{o.customer_name}</td>
                      <td>{o.city}</td>
                      <td className={ui.num}>{formatPKR(o.total)}</td>
                      <td>
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="low-stock" className={ui.card}>
          <div className={styles.sectionHead}>
            <h2 id="low-stock" className={ui.cardTitle}>
              Low stock
            </h2>
            <Link href="/admin/products" className={styles.more}>
              Products <Icon name="arrow" size={14} />
            </Link>
          </div>
          {stats.low_stock.length === 0 ? (
            <p className={ui.muted}>Every active watch has more than 3 in stock.</p>
          ) : (
            <ul className={styles.stockList}>
              {stats.low_stock.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? styles.soldOut : styles.low}>
                    {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, href, emphasis }: Stat) {
  const cls = [styles.stat, href && styles.statLink, emphasis && styles.emphasis]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
