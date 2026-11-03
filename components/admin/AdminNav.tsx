"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./AdminShell.module.scss";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "diamond" },
  { href: "/admin/orders", label: "Orders", icon: "bag" },
  { href: "/admin/products", label: "Products", icon: "clock" },
  { href: "/admin/messages", label: "Messages", icon: "mail" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "heart" },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavList({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Admin" className={styles.nav}>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={styles.navLink}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
            >
              <Icon name={l.icon} size={18} />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AdminNav() {
  return <NavList pathname={usePathname()} />;
}

// Shown while the pathname is unknown (dynamic routes like /admin/orders/[id]). A separate
// export, not AdminNav.Fallback: static properties don't survive the client boundary.
export function AdminNavFallback() {
  return <NavList pathname={null} />;
}
