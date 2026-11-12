"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartContext";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Icon } from "@/components/ui/Icon";
import { useBodyLock } from "@/lib/useBodyLock";
import { Logo } from "./Logo";
import styles from "./Header.module.scss";

const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/products/");
  return pathname.startsWith(href);
}

function NavLinks({ className }: { className: string }) {
  const pathname = usePathname();
  return nav.map((item) => (
    <li key={item.label}>
      <Link
        href={item.href}
        className={className}
        aria-current={isActive(pathname, item.href) ? "page" : undefined}
      >
        {item.label}
      </Link>
    </li>
  ));
}

// Rendered while the pathname is unknown during prerendering; same links, no active state.
function NavLinksFallback({ className }: { className: string }) {
  return nav.map((item) => (
    <li key={item.label}>
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    </li>
  ));
}

export function Header() {
  const { count, hydrated, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const badge = hydrated ? count : 0;

  useBodyLock(open, closeMenu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <button
            className={`${styles.iconButton} ${styles.menuToggle}`}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <nav className={styles.nav} aria-label="Primary">
            <ul>
              <Suspense fallback={<NavLinksFallback className={styles.navLink} />}>
                <NavLinks className={styles.navLink} />
              </Suspense>
            </ul>
          </nav>

          <Link href="/" className={styles.logo} aria-label="Zarvonique Watches home">
            <Logo layout="stacked" surface="dark" />
          </Link>

          <div className={styles.actions}>
            <button
              className={styles.iconButton}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" />
            </button>
            <Link
              href="/wishlist"
              className={`${styles.iconButton} ${styles.wishlist}`}
              aria-label="Wishlist"
            >
              <Icon name="heart" />
            </Link>
            <button
              className={styles.iconButton}
              aria-label={`Bag, ${badge} items`}
              onClick={openCart}
            >
              <Icon name="bag" />
              {/* Keyed on count so the bump animation replays on every add. */}
              <span
                key={badge}
                className={`${styles.count} ${badge ? styles.bump : ""}`}
                aria-hidden="true"
              >
                {badge}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.drawerTop}>
          <Logo layout="stacked" surface="dark" />
          <button className={styles.iconButton} aria-label="Close menu" onClick={closeMenu}>
            <Icon name="close" />
          </button>
        </div>
        <ul className={styles.drawerNav}>
          {nav.map((item, i) => (
            <li key={item.label} className={styles[`stagger${i}`]}>
              <Link href={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.drawerFoot}>
          <button
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
          >
            <Icon name="search" size={20} /> Search
          </button>
          <Link href="/wishlist" onClick={closeMenu}>
            <Icon name="heart" size={20} /> Wishlist
          </Link>
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
      <CartDrawer />
    </>
  );
}
