import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import styles from "./EmptyState.module.scss";

type Props = {
  icon: IconName;
  title: string;
  text: string;
  action?: { label: string; href: string };
};

export function EmptyState({ icon, title, text, action }: Props) {
  return (
    <div className={styles.empty}>
      <Icon name={icon} size={40} className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>
      {action && (
        <Button href={action.href} variant="dark" withArrow>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Neutral placeholder while localStorage-backed state hydrates.
export function LoadingState() {
  return <div className={styles.loading} aria-busy="true" />;
}
