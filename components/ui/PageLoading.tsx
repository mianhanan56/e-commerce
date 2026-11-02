import styles from "./PageLoading.module.scss";

// Route-level placeholder shown while a dynamic page's params resolve on navigation.
export function PageLoading() {
  return (
    <div className={styles.loading} aria-busy="true" aria-label="Loading">
      <span className={styles.line} />
    </div>
  );
}
