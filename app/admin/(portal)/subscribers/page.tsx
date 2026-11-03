import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDate } from "@/lib/orders";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data, error, count } = await supabase
    .from("newsletter_subscribers")
    .select("email, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(1000);
  const subscribers = data ?? [];
  const total = count ?? subscribers.length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Newsletter"
        title="Subscribers"
        subtitle={error ? undefined : `${total} ${total === 1 ? "person" : "people"} signed up`}
        actions={
          subscribers.length > 0 && (
            // A plain link: the route handler returns a file download.
            <a href="/admin/subscribers/export" className={`${ui.btn} ${ui.btnGhost}`}>
              Export CSV
            </a>
          )
        }
      />
      {error ? (
        <p className={ui.notice} role="alert">
          Couldn&apos;t load subscribers: {error.message}
        </p>
      ) : subscribers.length === 0 ? (
        <p className={ui.empty}>No subscribers yet. Sign-ups from the homepage appear here.</p>
      ) : (
        <div className={ui.grid}>
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.email}>
                    <td>
                      <a href={`mailto:${s.email}`} className={ui.link}>
                        {s.email}
                      </a>
                    </td>
                    <td className={ui.muted}>{formatDate(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > subscribers.length && (
            <p className={ui.muted}>
              Showing the newest {subscribers.length}. Export CSV for the full list.
            </p>
          )}
        </div>
      )}
    </>
  );
}
