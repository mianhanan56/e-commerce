"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { subscribeNewsletter } from "@/lib/actions/store";
import styles from "./Newsletter.module.scss";

export function Newsletter() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setError("");
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.ok) setDone(true);
      else setError(result.error);
    });
  };

  return (
    <section className={styles.section} aria-labelledby="newsletter-title">
      <Image src="/images/newsletter.jpg" alt="" fill sizes="100vw" className={styles.bg} />
      <Reveal className={styles.inner}>
        <p className={styles.eyebrow}>The WAQT Letter</p>
        <h2 id="newsletter-title" className={styles.title}>
          Stay Ahead of <em>Time</em>
        </h2>
        <p className={styles.text}>
          New arrivals, private previews and the occasional note on how to wear them. Once a month,
          never more.
        </p>

        {done ? (
          <p className={styles.thanks} role="status">
            Thank you — you&apos;re on the list.
          </p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor="newsletter-email" className={styles.srOnly}>
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Your email address"
              autoComplete="email"
              className={styles.input}
            />
            <button type="submit" className={styles.submit} disabled={pending}>
              {pending ? "Subscribing…" : "Subscribe"} <Icon name="arrow" size={18} />
            </button>
          </form>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </Reveal>
    </section>
  );
}
