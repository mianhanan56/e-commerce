"use server";

import {
  friendlyDbError,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
} from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { PaymentMethod, TrackedOrder } from "@/lib/supabase/types";

type Failure = { ok: false; error: string };

const NOT_CONNECTED =
  "Online ordering isn't connected yet. Please message us on WhatsApp to order.";

// Server Action arguments come straight from the browser: coerce and cap everything.
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type PlaceOrderInput = {
  customer: Record<CheckoutField, string>;
  payment: PaymentMethod;
  items: { productId: string; qty: number }[];
};

export type PlaceOrderResult =
  { ok: true; orderNumber: string; total: number } | (Failure & { fieldErrors?: CheckoutErrors });

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const customer = {
    name: str(input?.customer?.name, 100),
    phone: str(input?.customer?.phone, 20),
    email: str(input?.customer?.email, 254),
    city: str(input?.customer?.city, 60),
    address: str(input?.customer?.address, 300),
    notes: str(input?.customer?.notes, 500),
  };
  const fieldErrors = validateCheckout(customer);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const payment: PaymentMethod = input?.payment === "bank" ? "bank" : "cod";
  const items = (Array.isArray(input?.items) ? input.items : [])
    .slice(0, 20)
    .map((i) => ({ product_id: str(i?.productId, 80), qty: Math.trunc(Number(i?.qty)) }))
    .filter((i) => i.product_id && Number.isFinite(i.qty));
  if (items.length === 0) return { ok: false, error: "Your bag is empty." };

  if (!isSupabaseConfigured()) return { ok: false, error: NOT_CONNECTED };

  const { data, error } = await createPublicClient().rpc("create_order", {
    p_customer: customer,
    p_payment: payment,
    p_items: items,
  });
  if (error || !data?.[0]) {
    if (!error?.message?.match(/^(out_of_stock|product_unavailable|invalid_)/)) {
      console.error("create_order failed", error);
    }
    return { ok: false, error: friendlyDbError(error?.message, error?.details) };
  }
  return { ok: true, orderNumber: data[0].order_number, total: data[0].total };
}

export type TrackOrderResult = { ok: true; order: TrackedOrder } | Failure;

export async function trackOrder(orderNumber: string, contact: string): Promise<TrackOrderResult> {
  const number = str(orderNumber, 20);
  const who = str(contact, 254);
  if (!number || !who) {
    return { ok: false, error: "Enter your order number and the phone or email you used." };
  }
  if (!isSupabaseConfigured()) return { ok: false, error: NOT_CONNECTED };

  const { data, error } = await createPublicClient().rpc("track_order", {
    p_order_number: number,
    p_contact: who,
  });
  if (error) {
    console.error("track_order failed", error);
    return { ok: false, error: friendlyDbError(undefined) };
  }
  if (!data) {
    return {
      ok: false,
      error: "We couldn't find an order with those details. Check the number and contact.",
    };
  }
  return { ok: true, order: data as unknown as TrackedOrder };
}

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  orderNumber: string;
  message: string;
};

export async function submitContact(input: ContactInput): Promise<{ ok: true } | Failure> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Our inbox isn't connected yet. Please email or WhatsApp us." };
  }
  const { error } = await createPublicClient().rpc("submit_contact", {
    p_name: str(input?.name, 100),
    p_email: str(input?.email, 254),
    p_phone: str(input?.phone, 20),
    p_topic: str(input?.topic, 60),
    p_order_number: str(input?.orderNumber, 20),
    p_message: str(input?.message, 3000),
  });
  if (error) {
    if (!error.message.startsWith("invalid_")) console.error("submit_contact failed", error);
    return { ok: false, error: friendlyDbError(error.message) };
  }
  return { ok: true };
}

export async function subscribeNewsletter(email: string): Promise<{ ok: true } | Failure> {
  if (!isSupabaseConfigured()) return { ok: false, error: "Sign-ups open soon." };
  const { error } = await createPublicClient().rpc("subscribe_newsletter", {
    p_email: str(email, 254),
  });
  if (error) {
    if (error.message !== "invalid_email") console.error("subscribe_newsletter failed", error);
    return { ok: false, error: friendlyDbError(error.message) };
  }
  return { ok: true };
}
