"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useOrders, type Order } from "@/components/orders/OrdersContext";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatPKR } from "@/data/catalog";
import form from "@/components/ui/Form.module.scss";
import styles from "./CheckoutView.module.scss";

const cities = [
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

type Field = "name" | "phone" | "email" | "city" | "address";
type Errors = Partial<Record<Field, string>>;

const PHONE = /^(\+92|0092|0)?3\d{2}[\s-]?\d{7}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (data.name.length < 2) errors.name = "Please enter your full name.";
  if (!PHONE.test(data.phone)) errors.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567.";
  if (!EMAIL.test(data.email)) errors.email = "Enter a valid email address.";
  if (!data.city) errors.city = "Choose your city.";
  if (data.address.length < 10) errors.address = "Please include house, street and area.";
  return errors;
}

export function CheckoutView() {
  const { items, subtotal, savings, hydrated, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [errors, setErrors] = useState<Errors>({});
  const [placed, setPlaced] = useState<Order | null>(null);

  if (placed) return <Confirmation order={placed} />;
  if (!hydrated) return <LoadingState />;
  if (items.length === 0) {
    return (
      <EmptyState
        icon="bag"
        title="Nothing to check out"
        text="Your bag is empty. Add a watch and you'll be back here in a moment."
        action={{ label: "Shop Watches", href: "/shop" }}
      />
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const data = {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      city: get("city"),
      address: get("address"),
    };
    const next = validate(data);
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }

    const order = placeOrder({
      items: items.map((i) => ({
        id: i.id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        qty: i.qty,
      })),
      subtotal,
      payment: get("payment") === "bank" ? "bank" : "cod",
      customer: data,
    });
    clearCart();
    setPlaced(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fieldProps = (name: Field) => ({
    id: `checkout-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `checkout-${name}-error` : undefined,
  });

  const error = (name: Field) =>
    errors[name] && (
      <p id={`checkout-${name}-error`} className={form.error}>
        {errors[name]}
      </p>
    );

  return (
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <span>01</span> Contact
          </legend>
          <div className={form.form}>
            <div className={form.field}>
              <label htmlFor="checkout-name" className={form.label}>
                Full name
              </label>
              <input {...fieldProps("name")} className={form.input} autoComplete="name" />
              {error("name")}
            </div>
            <div className={form.row}>
              <div className={form.field}>
                <label htmlFor="checkout-phone" className={form.label}>
                  Mobile number
                </label>
                <input
                  {...fieldProps("phone")}
                  type="tel"
                  className={form.input}
                  autoComplete="tel"
                  placeholder="0300 1234567"
                />
                {error("phone")}
              </div>
              <div className={form.field}>
                <label htmlFor="checkout-email" className={form.label}>
                  Email
                </label>
                <input
                  {...fieldProps("email")}
                  type="email"
                  className={form.input}
                  autoComplete="email"
                />
                {error("email")}
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <span>02</span> Delivery
          </legend>
          <div className={form.form}>
            <div className={form.field}>
              <label htmlFor="checkout-city" className={form.label}>
                City
              </label>
              <select {...fieldProps("city")} className={form.select} defaultValue="">
                <option value="" disabled>
                  Select your city
                </option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {error("city")}
            </div>
            <div className={form.field}>
              <label htmlFor="checkout-address" className={form.label}>
                Address
              </label>
              <input
                {...fieldProps("address")}
                className={form.input}
                autoComplete="street-address"
                placeholder="House, street, area / sector"
              />
              {error("address")}
            </div>
            <div className={form.field}>
              <label htmlFor="checkout-notes" className={form.label}>
                Delivery notes <span className={form.hint}>(optional)</span>
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                className={form.textarea}
                placeholder="Nearest landmark, preferred delivery time…"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <span>03</span> Payment
          </legend>
          <div className={styles.choices}>
            <label className={form.choice}>
              <input type="radio" name="payment" value="cod" defaultChecked />
              <span>
                <span className={form.choiceTitle}>Cash on Delivery</span>
                <span className={form.choiceText}>
                  Pay the rider in cash when your watch arrives.
                </span>
              </span>
            </label>
            <label className={form.choice}>
              <input type="radio" name="payment" value="bank" />
              <span>
                <span className={form.choiceTitle}>Bank Transfer</span>
                <span className={form.choiceText}>
                  We&apos;ll send our account details by WhatsApp and email after you order.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <Button type="submit" variant="dark" block withArrow>
          Place Order · {formatPKR(subtotal)}
        </Button>
        <p className={styles.terms}>
          By placing your order you agree to our <Link href="/help/terms">Terms of Service</Link>{" "}
          and <Link href="/help/privacy">Privacy Policy</Link>.
        </p>
      </form>

      <aside className={styles.summary} aria-labelledby="checkout-summary-title">
        <h2 id="checkout-summary-title" className={styles.summaryTitle}>
          In your bag
        </h2>
        <ul className={styles.items}>
          {items.map(({ product, qty }) => (
            <li key={product.id} className={styles.item}>
              <span className={styles.thumb}>
                <Image src={product.image} alt="" fill sizes="64px" className={styles.image} />
                <span className={styles.qty}>{qty}</span>
              </span>
              <span className={styles.itemName}>
                {product.name}
                <span>{product.line}</span>
              </span>
              <span className={styles.itemPrice}>{formatPKR(product.price * qty)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={subtotal} savings={savings} />
        <p className={styles.secure}>
          <Icon name="shield" size={18} /> Every order is insured and tracked to your door.
        </p>
      </aside>
    </div>
  );
}

function Confirmation({ order }: { order: Order }) {
  const firstName = order.customer.name.split(" ")[0];
  const count = order.items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className={styles.confirm} role="status">
      <span className={styles.confirmIcon}>
        <Icon name="check" size={32} />
      </span>
      <p className={styles.confirmEyebrow}>Order {order.number}</p>
      <h2 className={styles.confirmTitle}>
        Thank you, <em>{firstName}</em>
      </h2>
      <p className={styles.confirmText}>
        We&apos;ve received your order for {count} {count === 1 ? "watch" : "watches"} (
        {formatPKR(order.subtotal)}). Our team will call {order.customer.phone} to confirm, then it
        ships to {order.customer.city} within 2–4 working days.
        {order.payment === "cod"
          ? " Please keep the exact amount ready for the rider."
          : " Bank details are on their way to your email and WhatsApp."}
      </p>
      <div className={styles.confirmActions}>
        <Button href="/track-order" variant="dark" withArrow>
          Track Your Order
        </Button>
        <Button href="/shop" variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
