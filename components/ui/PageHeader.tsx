import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
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
  // The last crumb is the current page and is never a link, here or in the structured data.
  const trail = all.map((c, i) => (i === all.length - 1 ? { label: c.label } : c));
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <JsonLd data={breadcrumbJsonLd(trail)} />
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
