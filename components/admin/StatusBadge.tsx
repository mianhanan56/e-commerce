import { PAYMENT_STATUS_LABEL, statusLabel } from "@/lib/orders";
import type { OrderStatus, PaymentStatus } from "@/lib/supabase/types";
import ui from "./Admin.module.scss";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`${ui.badge} ${ui[status]}`}>{statusLabel(status)}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={`${ui.badge} ${ui[status]}`}>{PAYMENT_STATUS_LABEL[status]}</span>;
}
