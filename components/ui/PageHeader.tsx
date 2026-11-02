import Link from "next/link";
import styles from "./PageHeader.module.scss";

export type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: Crumb[];
  align?: "left" | "center";
  children?: React.ReactNode;
};

// Title band for inner pages: breadcrumbs, eyebrow, serif title and optional intro.
export function PageHeader({ eyebrow, title, intro, crumbs, align = "left", children }: Props) {
  return (
    <header className={`${styles.header} ${styles[align]}`}>
      <div className={styles.inner}>
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
        {children}
      </div>
    </header>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <ol>
        {all.map((c, i) => (
          <li key={c.label}>
            {i === all.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : c.href ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
