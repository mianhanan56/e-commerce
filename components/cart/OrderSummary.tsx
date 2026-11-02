import { formatPKR } from "@/data/catalog";
import styles from "./OrderSummary.module.scss";

type Props = {
  subtotal: number;
  savings: number;
  children?: React.ReactNode;
};

export function OrderSummary({ subtotal, savings, children }: Props) {
  return (
    <dl className={styles.totals}>
      <div>
        <dt>Subtotal</dt>
        <dd>{formatPKR(subtotal + savings)}</dd>
      </div>
      {savings > 0 && (
        <div className={styles.savings}>
          <dt>Savings</dt>
          <dd>−{formatPKR(savings)}</dd>
        </div>
      )}
      <div>
        <dt>Delivery</dt>
        <dd>Free</dd>
      </div>
      {children}
      <div className={styles.total}>
        <dt>Total</dt>
        <dd>{formatPKR(subtotal)}</dd>
      </div>
    </dl>
  );
}
