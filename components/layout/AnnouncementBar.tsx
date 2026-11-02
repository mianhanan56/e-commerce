import styles from "./AnnouncementBar.module.scss";

export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <p>
        Complimentary Delivery Across Pakistan
        <span className={styles.secondary}>
          <span className={styles.dot} aria-hidden="true" />
          Cash on Delivery Available
        </span>
      </p>
    </div>
  );
}
