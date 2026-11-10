import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpContent } from "@/components/help/HelpContent";
import styles from "@/components/help/Help.module.scss";
import { PageHeader } from "@/components/ui/PageHeader";
import { getHelpPage, helpPages } from "@/data/help";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return helpPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/help/[slug]">): Promise<Metadata> {
  const page = getHelpPage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    description: page.intro,
    path: `/help/${page.slug}`,
    type: "article",
  });
}

export default async function HelpPage({ params }: PageProps<"/help/[slug]">) {
  const { slug } = await params;
  const page = getHelpPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Customer Care"
        title={page.title}
        intro={page.intro}
        crumbs={[{ label: "Help", href: "/help/faq" }, { label: page.nav }]}
      />
      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Help topics">
          <ul>
            {helpPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/help/${p.slug}`}
                  className={`${styles.navLink} ${p.slug === slug ? styles.active : ""}`}
                  aria-current={p.slug === slug ? "page" : undefined}
                >
                  {p.nav}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/track-order" className={styles.navLink}>
                Track Your Order
              </Link>
            </li>
          </ul>
          <div className={styles.help}>
            <p>Still need help?</p>
            <Link href="/contact">Contact our team</Link>
          </div>
        </nav>

        <article className={styles.content}>
          {page.updated && <p className={styles.updated}>Last updated {page.updated}</p>}
          <HelpContent blocks={page.blocks} />
        </article>
      </div>
    </>
  );
}
