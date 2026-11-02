import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <p className={styles.code}>404</p>
      <p className={styles.eyebrow}>Page not found</p>
      <h1 id="not-found-title" className={styles.title}>
        This moment has <em>passed</em>
      </h1>
      <p className={styles.text}>
        The page you&apos;re looking for has moved or no longer exists. Let&apos;s get you back on
        time.
      </p>
      <div className={styles.ctas}>
        <Button href="/shop" variant="dark" withArrow>
          Shop All Watches
        </Button>
        <Button href="/" variant="outline">
          Back to Home
        </Button>
      </div>
    </section>
  );
}
