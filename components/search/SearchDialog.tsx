"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { categories, formatPKR, searchProducts } from "@/data/catalog";
import { useBodyLock } from "@/lib/useBodyLock";
import styles from "./SearchDialog.module.scss";

const suggestions = ["Automatic", "Chronograph", "Leather", "Gold", "Diver"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = searchProducts(query);
  const trimmed = query.trim();

  useBodyLock(open, onClose);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trimmed) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={`${styles.root} ${open ? styles.open : ""}`} aria-hidden={!open} inert={!open}>
      <div className={styles.scrim} onClick={onClose} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Search watches">
        <div className={styles.inner}>
          <form className={styles.form} role="search" onSubmit={onSubmit}>
            <Icon name="search" size={24} className={styles.formIcon} />
            <label htmlFor="site-search" className={styles.srOnly}>
              Search watches
            </label>
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, style or strap…"
              autoComplete="off"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close search"
            >
              <Icon name="close" />
            </button>
          </form>

          {!trimmed ? (
            <div className={styles.idle}>
              <div>
                <p className={styles.label}>Popular searches</p>
                <ul className={styles.chips}>
                  {suggestions.map((s) => (
                    <li key={s}>
                      <button className={styles.chip} onClick={() => setQuery(s)}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={styles.label}>Collections</p>
                <ul className={styles.chips}>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        className={styles.chip}
                        onClick={onClose}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className={styles.none} role="status">
              No watches match “{trimmed}”. Try a style like <em>leather</em> or{" "}
              <em>chronograph</em>.
            </p>
          ) : (
            <>
              <p className={styles.label} role="status">
                {results.length} {results.length === 1 ? "watch" : "watches"} found
              </p>
              <ul className={styles.results}>
                {results.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.id}`} className={styles.result} onClick={onClose}>
                      <span className={styles.thumb}>
                        <Image src={p.image} alt="" fill sizes="72px" className={styles.image} />
                      </span>
                      <span>
                        <span className={styles.name}>{p.name}</span>
                        <span className={styles.meta}>{p.line}</span>
                        <span className={styles.price}>{formatPKR(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/shop?q=${encodeURIComponent(trimmed)}`}
                className={styles.all}
                onClick={onClose}
              >
                View all results <Icon name="arrow" size={16} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
