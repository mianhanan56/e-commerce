// Database types for supabase/migrations. Hand-written to match the schema until a project
// exists; then replace this whole file with the generated version:
//   npx supabase gen types typescript --project-id <ref> --schema public > lib/supabase/database.types.ts
// App code imports from ./types, which derives its names from `Database`.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type OrderStatus =
  "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
type PaymentMethod = "cod" | "bank";
type PaymentStatus = "unpaid" | "paid" | "refunded";
type AdminRole = "owner" | "staff";

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type AdminRow = { user_id: string; name: string; role: AdminRole; created_at: string };

type CategoryRow = {
  slug: string;
  name: string;
  description: string;
  story: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  line: string;
  description: string;
  category: string;
  price: number;
  original_price: number | null;
  stock: number;
  image: string;
  specs: Json;
  is_new: boolean;
  bestseller: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  savings: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string | null;
  internal_notes: string | null;
  courier: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: number;
  order_id: string;
  product_id: string | null;
  name: string;
  line: string;
  image: string;
  unit_price: number;
  original_price: number | null;
  qty: number;
};

type OrderEventRow = {
  id: number;
  order_id: string;
  type: "created" | "status" | "payment" | "shipping";
  status: OrderStatus | null;
  message: string;
  actor: string | null;
  created_at: string;
};

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  order_number: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

type SubscriberRow = { email: string; created_at: string };

export type Database = {
  public: {
    Tables: {
      admins: Table<AdminRow, never, never>;
      categories: Table<CategoryRow, Pick<CategoryRow, "slug" | "name"> & Partial<CategoryRow>>;
      products: Table<
        ProductRow,
        Pick<ProductRow, "id" | "name" | "category" | "price"> & Partial<ProductRow>
      >;
      orders: Table<
        OrderRow,
        never,
        Partial<
          Pick<
            OrderRow,
            "status" | "payment_status" | "courier" | "tracking_number" | "internal_notes"
          >
        >
      >;
      order_items: Table<OrderItemRow, never, never>;
      order_events: Table<OrderEventRow, never, never>;
      contact_messages: Table<
        ContactMessageRow,
        never,
        Partial<Pick<ContactMessageRow, "handled">>
      >;
      newsletter_subscribers: Table<SubscriberRow, never, never>;
    };
    Views: { [_ in never]: never };
    Functions: {
      create_order: {
        Args: { p_customer: Json; p_payment: PaymentMethod; p_items: Json };
        Returns: { order_number: string; total: number }[];
      };
      track_order: {
        Args: { p_order_number: string; p_contact: string };
        Returns: Json;
      };
      submit_contact: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone: string;
          p_topic: string;
          p_order_number: string;
          p_message: string;
        };
        Returns: undefined;
      };
      subscribe_newsletter: { Args: { p_email: string }; Returns: undefined };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      admin_dashboard: { Args: Record<string, never>; Returns: Json };
    };
    Enums: {
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      admin_role: AdminRole;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
