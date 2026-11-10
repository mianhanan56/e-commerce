import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { collectionHref, type Category } from "@/data/catalog";
import { Logo } from "./Logo";
import styles from "./Footer.module.scss";

const shopLinks = [
  { label: "All Watches", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Best Sellers", href: "/shop?filter=bestseller" },
];

const careColumn = {
  title: "Customer Care",
  links: [
    { label: "Track Your Order", href: "/track-order" },
    { label: "Shipping & Delivery", href: "/help/shipping" },
    { label: "Returns & Exchanges", href: "/help/returns" },
    { label: "Warranty", href: "/help/warranty" },
    { label: "Size & Fit Guide", href: "/help/size-guide" },
    { label: "FAQs", href: "/help/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
};

// Placeholder profiles — swap for the brand's real handles before launch.
const socials: { name: IconName; label: string; href: string }[] = [
  { name: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { name: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { name: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { name: "whatsapp", label: "WhatsApp", href: "https://wa.me/923000000000" },
];

export function Footer({ categories }: { categories: Category[] }) {
  const columns = [
    {
      title: "Shop",
      links: [
        ...shopLinks,
        ...categories.map((c) => ({ label: c.name, href: collectionHref(c.slug) })),
      ],
    },
    careColumn,
  ];

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo layout="stacked" surface="dark" />
          <p className={styles.about}>
            Men&apos;s watches chosen for character and built to last. Delivered free across
            Pakistan, with cash on delivery.
          </p>
          <ul className={styles.socials}>
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className={styles.social}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={s.name} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <nav key={col.title} className={styles.col} aria-label={col.title}>
            <h3 className={styles.heading}>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={styles.link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.col}>
          <h3 className={styles.heading}>Contact</h3>
          <address className={styles.contact}>
            <a href="tel:+923000000000" className={styles.link}>
              +92 300 000 0000
            </a>
            <a href="mailto:zarvonique@gmail.com" className={styles.link}>
              zarvonique@gmail.com
            </a>
            <span className={styles.hours}>24 hours, Monday – Sunday</span>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Zarvonique. All rights reserved.</p>
        <ul className={styles.legal}>
          <li>
            <Link href="/help/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/help/terms">Terms of Service</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
