import type { Database } from "./database.types";

export type { Database, Json } from "./database.types";

type Public = Database["public"];
type Tables = Public["Tables"];

export type OrderStatus = Public["Enums"]["order_status"];
export type PaymentMethod = Public["Enums"]["payment_method"];
export type PaymentStatus = Public["Enums"]["payment_status"];
export type AdminRole = Public["Enums"]["admin_role"];

export type AdminRow = Tables["admins"]["Row"];
export type CategoryRow = Tables["categories"]["Row"];
export type ProductRow = Tables["products"]["Row"];
export type OrderRow = Tables["orders"]["Row"];
export type OrderItemRow = Tables["order_items"]["Row"];
export type OrderEventRow = Tables["order_events"]["Row"];
export type ContactMessageRow = Tables["contact_messages"]["Row"];
export type SubscriberRow = Tables["newsletter_subscribers"]["Row"];

// Shapes returned by the jsonb functions.
export type TrackedOrder = {
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  savings: number;
  total: number;
  city: string;
  courier: string | null;
  tracking_number: string | null;
  created_at: string;
  items: {
    product_id: string | null;
    name: string;
    line: string;
    image: string;
    unit_price: number;
    qty: number;
  }[];
  events: { status: OrderStatus; created_at: string }[];
};

export type DashboardStats = {
  pending: number;
  to_ship: number;
  orders_today: number;
  revenue_7d: number;
  revenue_30d: number;
  orders_30d: number;
  unhandled_messages: number;
  subscribers: number;
  low_stock: { id: string; name: string; stock: number }[];
};
