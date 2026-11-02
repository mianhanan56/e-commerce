import styles from "./Wordmark.module.scss";

export function Wordmark({ tone = "inherit" }: { tone?: "inherit" | "light" }) {
  return (
    <span className={`${styles.wordmark} ${tone === "light" ? styles.light : ""}`}>
      <span className={styles.name}>WAQT</span>
      <span className={styles.tag}>Est. Lahore</span>
    </span>
  );
}
