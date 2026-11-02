import styles from "./SectionHeading.module.scss";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "dark" | "light";
  align?: "split" | "center";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "split",
  id,
}: Props) {
  return (
    <header className={`${styles.heading} ${intro ? styles[align] : ""} ${styles[tone]}`}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
      </div>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  );
}
