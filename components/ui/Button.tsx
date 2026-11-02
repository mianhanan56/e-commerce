import Link from "next/link";
import { Icon } from "./Icon";
import styles from "./Button.module.scss";

type Common = {
  children: React.ReactNode;
  variant?: "gold" | "light" | "outline" | "outlineLight" | "dark";
  withArrow?: boolean;
  block?: boolean;
  className?: string;
};

type LinkProps = Common & { href: string };
type ButtonProps = Common & {
  href?: undefined;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(props: LinkProps | ButtonProps) {
  const { children, variant = "gold", withArrow, block, className } = props;
  const cls = [styles.button, styles[variant], block && styles.block, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <span>{children}</span>
      {withArrow && <Icon name="arrow" size={18} className={styles.arrow} />}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={cls}
    >
      {content}
    </button>
  );
}
