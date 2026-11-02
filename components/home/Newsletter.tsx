"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Newsletter.module.scss";

export function Newsletter() {
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
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
              type="email"
              required
              placeholder="Your email address"
              autoComplete="email"
              className={styles.input}
            />
            <button type="submit" className={styles.submit}>
              Subscribe <Icon name="arrow" size={18} />
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
