"use server";

import { refresh, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { COURIERS, friendlyDbError, ORDER_STATUSES, PAYMENT_STATUS_LABEL } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import type { OrderRow, OrderStatus, PaymentStatus } from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Returns the email with errors: React resets the form after an action, and the login form
// uses it as the default value so a failed attempt doesn't wipe the field.
export type SignInState = { error: string; email: string } | null;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .slice(0, 254);
  const password = String(formData.get("password") ?? "");
  const fail = (error: string) => ({ error, email });

  if (!isSupabaseConfigured()) return fail("Supabase isn't configured yet.");
  if (!email || !password) return fail("Enter your email and password.");

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Supabase answers "invalid_credentials" both for unknown emails and wrong passwords.
    if (error.code === "invalid_credentials") {
      return fail("That email and password don't match an account.");
    }
    if (error.code === "email_not_confirmed") {
      return fail(
        "This account isn't confirmed yet. In Supabase → Authentication → Users, confirm it (or re-create it with “Auto Confirm User”).",
      );
    }
    console.error("signIn failed", error);
    return fail("Couldn't reach the sign-in service. Please try again in a moment.");
  }

  // getAdmin() is cached per request and ran before sign-in, so check membership directly.
  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    if (adminError?.code === "PGRST205") {
      return fail("The database isn't set up yet: run the migration from supabase/README.md.");
    }
    if (adminError) console.error("admin lookup failed", adminError);
    return fail(
      "Signed in, but this account doesn't have admin access yet. Add it to public.admins (supabase/README.md, step 4).",
    );
  }
  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export type OrderPatch = Partial<
  Pick<OrderRow, "status" | "payment_status" | "courier" | "tracking_number" | "internal_notes">
>;

export async function updateOrder(orderId: string, patch: OrderPatch): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID.test(orderId)) return { ok: false, error: "Unknown order." };

  const update: OrderPatch = {};
  if (patch.status !== undefined) {
    if (!ORDER_STATUSES.some((s) => s.value === patch.status)) {
      return { ok: false, error: "Unknown status." };
    }
    update.status = patch.status as OrderStatus;
  }
  if (patch.payment_status !== undefined) {
    if (!(patch.payment_status in PAYMENT_STATUS_LABEL)) {
      return { ok: false, error: "Unknown payment status." };
    }
    update.payment_status = patch.payment_status as PaymentStatus;
  }
  if (patch.courier !== undefined) {
    const courier = String(patch.courier ?? "").trim();
    if (courier && !COURIERS.includes(courier)) return { ok: false, error: "Unknown courier." };
    update.courier = courier || null;
  }
  if (patch.tracking_number !== undefined) {
    update.tracking_number =
      String(patch.tracking_number ?? "")
        .trim()
        .slice(0, 60) || null;
  }
  if (patch.internal_notes !== undefined) {
    update.internal_notes =
      String(patch.internal_notes ?? "")
        .trim()
        .slice(0, 2000) || null;
  }
  if (Object.keys(update).length === 0) return { ok: true };

  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select("id");
  if (error) {
    if (error.message !== "cancelled_order_locked") console.error("updateOrder failed", error);
    return { ok: false, error: friendlyDbError(error.message) };
  }
  if (!data?.length) return { ok: false, error: "Order not found." };

  // Cancelling returns stock, which the store shows as "sold out" or not.
  if (update.status === "cancelled") revalidateTag(CATALOG_TAG, "max");
  refresh();
  return { ok: true };
}

export async function setMessageHandled(id: string, handled: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (!UUID.test(id)) return { ok: false, error: "Unknown message." };

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ handled: Boolean(handled) })
    .eq("id", id);
  if (error) {
    console.error("setMessageHandled failed", error);
    return { ok: false, error: friendlyDbError(undefined) };
  }
  refresh();
  return { ok: true };
}
