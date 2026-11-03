import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Dashboard } from "@/components/admin/dashboard/Dashboard";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import type { DashboardStats } from "@/lib/supabase/types";
import ui from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = { title: "Dashboard" };

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Karachi",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createSessionClient();

  const [stats, recent] = await Promise.all([
    supabase.rpc("admin_dashboard"),
    supabase
      .from("orders")
      .select("id, order_number, created_at, customer_name, city, total, status")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);
  const error = stats.error ?? recent.error;
  const firstName = (admin.name || admin.email).split(/[\s@]/)[0];

  return (
    <>
      <AdminPageHeader
        eyebrow="Dashboard"
        title={`${greeting()}, ${firstName}`}
        subtitle="Here's how the store is doing today."
      />
      {error ? (
        <p className={ui.notice} role="alert">
          Couldn&apos;t load the dashboard: {error.message}
        </p>
      ) : (
        <Dashboard stats={stats.data as unknown as DashboardStats} recent={recent.data ?? []} />
      )}
    </>
  );
}
