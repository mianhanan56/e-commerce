"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCatalog } from "@/components/catalog/CatalogContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { searchProducts } from "@/data/catalog";
import styles from "./ShopView.module.scss";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

const flags = [
  { value: "new", label: "New arrivals" },
  { value: "sale", label: "On sale" },
  { value: "bestseller", label: "Best sellers" },
] as const;

type Sort = (typeof sorts)[number]["value"];
type Flag = (typeof flags)[number]["value"];

// Shop path for a category, keeping the other filters (search, sort, flag) in the query.
function shopHref(category: string | undefined, query: URLSearchParams) {
  const qs = query.toString();
  const path = category ? `/shop/${encodeURIComponent(category)}` : "/shop";
  return qs ? `${path}?${qs}` : path;
}

// The category is part of the path (/shop/<slug>), so each one is its own indexable page.
// Search, sort and the new/sale/bestseller flags stay in the query string.
export function ShopView({ category }: { category?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const { products, categories } = useCatalog();
  const q = params.get("q")?.trim() ?? "";
  const sort: Sort = sorts.find((s) => s.value === params.get("sort"))?.value ?? "featured";
  const filter: Flag | undefined = flags.find((f) => f.value === params.get("filter"))?.value;

  // Query without the legacy `?category=` (old links are redirected to /shop/<slug> by proxy.ts).
  const query = new URLSearchParams(params.toString());
  query.delete("category");

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(query);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.replace(shopHref(category, next), { scroll: false });
  };

  const clearAll = () => router.push("/shop", { scroll: false });

  const results = useMemo(() => {
    let list = q ? searchProducts(products, q) : products;
    if (category) list = list.filter((p) => p.category === category);
    if (filter === "new") list = list.filter((p) => p.isNew);
    if (filter === "sale") list = list.filter((p) => p.originalPrice);
    if (filter === "bestseller") list = list.filter((p) => p.bestseller);

    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, q, category, filter, sort]);

  const filtered = Boolean(q || category || filter);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q")?.toString().trim();
    update({ q: value || undefined });
  };

  return (
    <section className={styles.section} aria-label="Watches">
      <div className={styles.inner}>
        <div className={styles.toolbar}>
          <ul className={styles.chips} aria-label="Filter by category">
            <li>
              <Link
                href={shopHref(undefined, query)}
                scroll={false}
                className={styles.chip}
                aria-current={!category ? "page" : undefined}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={shopHref(c.slug, query)}
                  scroll={false}
                  className={styles.chip}
                  aria-current={category === c.slug ? "page" : undefined}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <form key={q} role="search" className={styles.search} onSubmit={onSearch}>
            <label htmlFor="shop-q" className={styles.srOnly}>
              Search watches
            </label>
            <Icon name="search" size={18} />
            <input
              id="shop-q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search watches"
              className={styles.searchInput}
            />
          </form>
        </div>

        <div className={styles.bar}>
          <div className={styles.count}>
            <p aria-live="polite">
              {results.length} {results.length === 1 ? "watch" : "watches"}
              {q && (
                <>
                  {" "}
                  for <em>&ldquo;{q}&rdquo;</em>
                </>
              )}
            </p>
            {filtered && (
              <button className={styles.clear} onClick={clearAll}>
                <Icon name="close" size={14} /> Clear filters
              </button>
            )}
          </div>

          <div className={styles.refine}>
            <div className={styles.flags} role="group" aria-label="Refine">
              {flags.map((f) => (
                <button
                  key={f.value}
                  className={styles.flag}
                  aria-pressed={filter === f.value}
                  onClick={() => update({ filter: filter === f.value ? undefined : f.value })}
                >
                  {filter === f.value && <Icon name="check" size={14} />}
                  {f.label}
                </button>
              ))}
            </div>

            <Dropdown
              label="Sort"
              value={sort}
              options={sorts}
              onChange={(v) => update({ sort: v === "featured" ? undefined : v })}
              className={styles.sort}
            />
          </div>
        </div>

        {results.length > 0 ? (
          <ProductGrid products={results} eager={4} />
        ) : (
          <div className={styles.empty}>
            <h2 className={styles.emptyTitle}>
              Nothing matches <em>just yet</em>
            </h2>
            <p>Try a different search, or browse the full range.</p>
            <Button variant="outline" withArrow onClick={clearAll}>
              View all watches
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
