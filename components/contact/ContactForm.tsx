"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import f from "@/components/ui/Form.module.scss";
import { submitContact } from "@/lib/actions/store";
import styles from "./Contact.module.scss";

const topics = ["Order", "Product question", "Returns & warranty", "Corporate gifting", "Other"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 10) errors.message = "Please write at least a few words.";
  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = validate(data);
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0 || pending) return;

    const get = (k: string) => String(data.get(k) ?? "");
    startTransition(async () => {
      const result = await submitContact({
        name: get("name"),
        email: get("email"),
        phone: get("phone"),
        topic: get("topic"),
        orderNumber: get("order"),
        message: get("message"),
      });
      if (result.ok) setSentTo(get("name").trim().split(" ")[0]);
      else setFormError(result.error);
    });
  };

  if (sentTo) {
    return (
      <div className={styles.thanks} role="status">
        <Icon name="check" size={28} className={styles.thanksIcon} />
        <p className={styles.thanksTitle}>Thank you, {sentTo}.</p>
        <p className={styles.thanksText}>
          Your message is with our team. We&apos;ll reply by email within one working day — or
          sooner on WhatsApp if it&apos;s urgent.
        </p>
        <Button variant="outline" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  const fieldProps = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  return (
    <form className={f.form} onSubmit={onSubmit} noValidate>
      <div className={f.row}>
        <div className={f.field}>
          <label htmlFor="contact-name" className={f.label}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            className={f.input}
            {...fieldProps("name")}
          />
          {errors.name && (
            <p id="contact-name-error" className={f.error}>
              {errors.name}
            </p>
          )}
        </div>
        <div className={f.field}>
          <label htmlFor="contact-email" className={f.label}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            className={f.input}
            {...fieldProps("email")}
          />
          {errors.email && (
            <p id="contact-email-error" className={f.error}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={f.row}>
        <div className={f.field}>
          <label htmlFor="contact-phone" className={f.label}>
            Phone <span className={f.hint}>(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="03XX XXXXXXX"
            className={f.input}
          />
        </div>
        <div className={f.field}>
          <label htmlFor="contact-topic" className={f.label}>
            Topic
          </label>
          <select id="contact-topic" name="topic" className={f.select} defaultValue={topics[0]}>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={f.field}>
        <label htmlFor="contact-order" className={f.label}>
          Order number <span className={f.hint}>(optional)</span>
        </label>
        <input id="contact-order" name="order" placeholder="WQ-123456" className={f.input} />
      </div>

      <div className={f.field}>
        <label htmlFor="contact-message" className={f.label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          className={f.textarea}
          {...fieldProps("message")}
        />
        {errors.message && (
          <p id="contact-message-error" className={f.error}>
            {errors.message}
          </p>
        )}
      </div>

      {formError && (
        <p className={f.error} role="alert">
          {formError}
        </p>
      )}
      <Button type="submit" variant="dark" withArrow={!pending} block disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
