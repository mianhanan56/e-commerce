import type { OrderStatus, PaymentMethod, PaymentStatus } from "./supabase/types";

// Shared by the storefront and the admin portal. Rules mirror the checks in
// public.create_order(), which remains the authority.

export const ORDER_STATUSES: { value: OrderStatus; label: string; description: string }[] = [
  { value: "pending", label: "Pending", description: "Placed, waiting for our confirmation call." },
  { value: "confirmed", label: "Confirmed", description: "Confirmed with the customer." },
  { value: "packed", label: "Packed", description: "Inspected, boxed and sealed." },
  { value: "shipped", label: "Shipped", description: "With the courier, insured and tracked." },
  { value: "delivered", label: "Delivered", description: "Delivered to the customer." },
  { value: "cancelled", label: "Cancelled", description: "Cancelled. Stock has been returned." },
  { value: "returned", label: "Returned", description: "Returned by the customer." },
];

export const statusLabel = (s: OrderStatus) =>
  ORDER_STATUSES.find((x) => x.value === s)?.label ?? s;

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

export const COURIERS = ["PostEx", "Trax", "Leopards", "TCS", "M&P", "Call Courier", "Other"];

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Other",
];

export type CheckoutField = "name" | "phone" | "email" | "city" | "address" | "notes";
export type CheckoutInput = Record<CheckoutField, string>;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

// Same shapes public.normalize_pk_phone() accepts: 0300…, 300…, +92 300…, 0092…, any spacing.
const PHONE = /^(\+92|0092|92|0)?3\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(data: CheckoutInput): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (data.name.length < 2 || data.name.length > 100) errors.name = "Please enter your full name.";
  if (!PHONE.test(data.phone.replace(/[\s()-]/g, "")))
    errors.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.city) errors.city = "Choose your city.";
  if (data.address.length < 10) errors.address = "Please include house, street and area.";
  else if (data.address.length > 300) errors.address = "Please shorten the address.";
  if (data.notes.length > 500) errors.notes = "Please keep notes under 500 characters.";
  return errors;
}

// Maps the stable error messages raised by the database functions to customer copy.
export function friendlyDbError(message: string | undefined, detail?: string | null) {
  switch (message) {
    case "out_of_stock":
      return `Sorry — ${detail || "one of your watches"} doesn't have enough stock left. Please lower the quantity or remove it.`;
    case "product_unavailable":
      return "One of the watches in your bag is no longer available. Please remove it and try again.";
    case "invalid_quantity":
      return "You can order up to 5 of each watch.";
    case "invalid_phone":
      return "Enter a Pakistani mobile number, e.g. 0300 1234567.";
    case "invalid_email":
      return "Enter a valid email address.";
    case "invalid_name":
      return "Please enter your full name.";
    case "invalid_address":
      return "Please include house, street and area.";
    case "invalid_message":
      return "Please write a message of at least 10 characters.";
    case "cancelled_order_locked":
      return "Cancelled orders can't be reopened.";
    default:
      return "Something went wrong on our side. Please try again, or contact us on WhatsApp.";
  }
}

export function formatPhone(phone: string) {
  return /^03\d{9}$/.test(phone) ? `${phone.slice(0, 4)} ${phone.slice(4)}` : phone;
}

export function whatsappLink(phone: string, text?: string) {
  const intl = phone.replace(/^0/, "92");
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

const dateTime = new Intl.DateTimeFormat("en-PK", {
  timeZone: "Asia/Karachi",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const dateOnly = new Intl.DateTimeFormat("en-PK", {
  timeZone: "Asia/Karachi",
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Always Pakistan time, whatever timezone the server runs in.
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
export const formatDate = (iso: string) => dateOnly.format(new Date(iso));
