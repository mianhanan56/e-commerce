import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PaymentBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { formatPKR } from "@/data/catalog";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateTime, formatPhone, ORDER_STATUSES, PAYMENT_METHOD_LABEL } from "@/lib/orders";
import { createSessionClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/supabase/types";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/orders/Orders.module.scss";

export const metadata: Metadata = { title: "Orders" };

const PAGE_SIZE = 25;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

function ordersHref(params: { status?: string; q?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/admin/orders?${qs}` : "/admin/orders";
}

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = ORDER_STATUSES.find((s) => s.value === first(sp.status))?.value;
  const q = first(sp.q).trim().slice(0, 80);
  const page = Math.max(1, Math.trunc(Number(first(sp.page))) || 1);

  const supabase = await createSessionClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, created_at, customer_name, phone, city, total, payment_method, payment_status, status",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status) query = query.eq("status", status as OrderStatus);

  // PostgREST .or() syntax treats , ( ) : as structure; keep only search-safe characters.
  const term = q.replace(/[^\p{L}\p{N}\s@.+_-]/gu, "").trim();
  if (term) {
    const phone = term.replace(/[\s-]/g, "").replace(/^(\+92|0092|92)/, "0");
    const filters = ["order_number", "customer_name", "email", "city"].map(
      (col) => `${col}.ilike.*${term}*`,
    );
    if (/^\+?\d+$/.test(phone)) filters.push(`phone.ilike.*${phone}*`);
    query = query.or(filters.join(","));
  }

  const { data: orders, count, error } = await query;

  const ids = (orders ?? []).map((o) => o.id);
  const { data: items } = ids.length
    ? await supabase.from("order_items").select("order_id, qty").in("order_id", ids)
    : { data: [] as { order_id: string; qty: number }[] };
  const itemCount = new Map<string, number>();
  for (const i of items ?? []) itemCount.set(i.order_id, (itemCount.get(i.order_id) ?? 0) + i.qty);

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders"
        subtitle={`${total} ${total === 1 ? "order" : "orders"}${status ? ` · ${ORDER_STATUSES.find((s) => s.value === status)?.label}` : ""}${q ? ` matching “${q}”` : ""}`}
      />

      <div className={styles.toolbar}>
        <nav aria-label="Filter by status" className={styles.tabs}>
          <Link
            href={ordersHref({ q })}
            className={styles.tab}
            aria-current={!status ? "page" : undefined}
          >
            All
          </Link>
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={ordersHref({ status: s.value, q })}
              className={styles.tab}
              aria-current={status === s.value ? "page" : undefined}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <form action="/admin/orders" className={styles.search} role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="orders-q" className={styles.srOnly}>
            Search orders
          </label>
          <input
            id="orders-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Order #, name, phone, email or city"
            className={ui.input}
          />
          <button type="submit" className={`${ui.btn} ${ui.btnGhost}`}>
            Search
          </button>
        </form>
      </div>

      {error ? (
        <p className={ui.notice} role="alert">
          Couldn&apos;t load orders: {error.message}
        </p>
      ) : !orders?.length ? (
        <div className={ui.empty}>
          {q || status ? (
            <>
              No orders match these filters.{" "}
              <Link href="/admin/orders" className={ui.link}>
                Show all orders
              </Link>
            </>
          ) : (
            "No orders yet. They'll appear here as soon as a customer checks out."
          )}
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Placed</th>
                <th scope="col">Customer</th>
                <th scope="col">City</th>
                <th scope="col" className={ui.num}>
                  Items
                </th>
                <th scope="col" className={ui.num}>
                  Total
                </th>
                <th scope="col">Payment</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={styles.row}>
                  <td>
                    <Link href={`/admin/orders/${o.id}`} className={styles.rowLink}>
                      {o.order_number}
                    </Link>
                  </td>
                  <td>{formatDateTime(o.created_at)}</td>
                  <td>
                    {o.customer_name}
                    <span className={styles.sub}>{formatPhone(o.phone)}</span>
                  </td>
                  <td>{o.city}</td>
                  <td className={ui.num}>{itemCount.get(o.id) ?? "—"}</td>
                  <td className={ui.num}>{formatPKR(o.total)}</td>
                  <td>
                    <span className={styles.payment}>
                      {PAYMENT_METHOD_LABEL[o.payment_method]}
                      <PaymentBadge status={o.payment_status} />
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className={styles.pagination}>
          {page > 1 ? (
            <Link
              href={ordersHref({ status, q, page: page - 1 })}
              className={`${ui.btn} ${ui.btnGhost}`}
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className={ui.muted}>
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={ordersHref({ status, q, page: page + 1 })}
              className={`${ui.btn} ${ui.btnGhost}`}
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
