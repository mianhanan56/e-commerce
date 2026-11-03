import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import ui from "@/components/admin/Admin.module.scss";

export default function OrderNotFound() {
  return (
    <>
      <AdminPageHeader eyebrow="Orders" title="Order not found" />
      <div className={ui.empty}>
        This order doesn&apos;t exist or the link is wrong.{" "}
        <Link href="/admin/orders" className={ui.link}>
          Back to all orders
        </Link>
      </div>
    </>
  );
}
