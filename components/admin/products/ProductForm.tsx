"use client";

import { useState } from "react";
import { ImageField } from "@/components/admin/catalog/ImageField";
import { SaveBar, useCatalogSave } from "@/components/admin/catalog/SaveBar";
import { saveProduct } from "@/lib/actions/catalog";
import { slugify, SPEC_FIELDS } from "@/lib/admin/catalog-fields";
import type { CategoryRow, ProductRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "../catalog/CatalogForm.module.scss";

type Props = {
  product?: ProductRow;
  categories: Pick<CategoryRow, "slug" | "name">[];
  defaultCategory?: string;
};

export function ProductForm({ product, categories, defaultCategory }: Props) {
  const creating = !product;
  const { pending, result, onSubmit } = useCatalogSave(saveProduct);
  const [name, setName] = useState(product?.name ?? "");
  const [id, setId] = useState(product?.id ?? "");
  // Until the ID is edited by hand, it follows the name.
  const [idTouched, setIdTouched] = useState(false);
  const image = result?.ok ? result.image : (product?.image ?? "");
  const specs = (product?.specs ?? {}) as Record<string, string | undefined>;

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <input type="hidden" name="mode" value={creating ? "create" : "edit"} />

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={ui.card} aria-labelledby="pf-details">
            <h2 id="pf-details" className={ui.cardTitle}>
              Details
            </h2>
            <div className={styles.fields}>
              <div>
                <label htmlFor="pf-name" className={ui.label}>
                  Watch name
                </label>
                <input
                  id="pf-name"
                  name="name"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (creating && !idTouched) setId(slugify(e.target.value));
                  }}
                  className={ui.input}
                  placeholder="e.g. Noir Automatic"
                />
              </div>

              <div>
                <label htmlFor="pf-id" className={ui.label}>
                  Product ID (web address)
                </label>
                <div className={styles.prefixed}>
                  <span>/products/</span>
                  <input
                    id="pf-id"
                    name="id"
                    required
                    maxLength={60}
                    value={id}
                    readOnly={!creating}
                    onChange={(e) => {
                      setIdTouched(true);
                      setId(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      );
                    }}
                    className={[ui.input, !creating && styles.readonly].filter(Boolean).join(" ")}
                    aria-describedby="pf-id-hint"
                  />
                </div>
                <p id="pf-id-hint" className={styles.hint}>
                  {creating
                    ? "Lowercase letters, numbers and dashes. It can't be changed later."
                    : "The ID can't change: it's the watch's web address and appears on past orders."}
                </p>
              </div>

              <div>
                <label htmlFor="pf-line" className={ui.label}>
                  Short line
                </label>
                <input
                  id="pf-line"
                  name="line"
                  maxLength={120}
                  defaultValue={product?.line}
                  className={ui.input}
                  placeholder="e.g. Steel · 40mm"
                  aria-describedby="pf-line-hint"
                />
                <p id="pf-line-hint" className={styles.hint}>
                  Shown under the name on product cards.
                </p>
              </div>

              <div>
                <label htmlFor="pf-description" className={ui.label}>
                  Description
                </label>
                <textarea
                  id="pf-description"
                  name="description"
                  maxLength={3000}
                  rows={5}
                  defaultValue={product?.description}
                  className={ui.textarea}
                />
              </div>
            </div>
          </section>

          <section className={ui.card} aria-labelledby="pf-pricing">
            <h2 id="pf-pricing" className={ui.cardTitle}>
              Price &amp; stock
            </h2>
            <div className={styles.row3}>
              <div>
                <label htmlFor="pf-price" className={ui.label}>
                  Price (Rs)
                </label>
                <input
                  id="pf-price"
                  name="price"
                  inputMode="numeric"
                  required
                  defaultValue={product?.price}
                  className={ui.input}
                  placeholder="e.g. 38500"
                />
              </div>
              <div>
                <label htmlFor="pf-original" className={ui.label}>
                  Original price (Rs)
                </label>
                <input
                  id="pf-original"
                  name="original_price"
                  inputMode="numeric"
                  defaultValue={product?.original_price ?? ""}
                  className={ui.input}
                  placeholder="Optional"
                  aria-describedby="pf-original-hint"
                />
                <p id="pf-original-hint" className={styles.hint}>
                  Fill in to show a sale: the old price is struck through.
                </p>
              </div>
              <div>
                <label htmlFor="pf-stock" className={ui.label}>
                  In stock
                </label>
                <input
                  id="pf-stock"
                  name="stock"
                  inputMode="numeric"
                  required
                  defaultValue={product?.stock}
                  className={ui.input}
                  placeholder="e.g. 10"
                  aria-describedby="pf-stock-hint"
                />
                <p id="pf-stock-hint" className={styles.hint}>
                  0 shows “Sold out”. Orders lower it automatically.
                </p>
              </div>
            </div>
          </section>

          <section className={ui.card} aria-labelledby="pf-specs">
            <h2 id="pf-specs" className={ui.cardTitle}>
              Specifications
            </h2>
            <div className={styles.row}>
              {SPEC_FIELDS.map((f) => (
                <div key={f.key}>
                  <label htmlFor={`pf-spec-${f.key}`} className={ui.label}>
                    {f.label}
                  </label>
                  <input
                    id={`pf-spec-${f.key}`}
                    name={`spec_${f.key}`}
                    maxLength={120}
                    defaultValue={specs[f.key] ?? ""}
                    className={ui.input}
                    placeholder={`e.g. ${f.placeholder}`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.side}>
          <section className={ui.card} aria-labelledby="pf-photo">
            <h2 id="pf-photo" className={ui.cardTitle}>
              Photo
            </h2>
            <ImageField key={image} value={image} label={name || "Watch photo"} />
          </section>

          <section className={ui.card} aria-labelledby="pf-organise">
            <h2 id="pf-organise" className={ui.cardTitle}>
              Store
            </h2>
            <div className={styles.fields}>
              <div>
                <label htmlFor="pf-category" className={ui.label}>
                  Collection
                </label>
                <select
                  id="pf-category"
                  name="category"
                  required
                  defaultValue={product?.category ?? defaultCategory ?? categories[0]?.slug}
                  className={ui.select}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.checks}>
                <label className={styles.check}>
                  <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
                  <strong>Visible in the store</strong>
                  <small>Untick to hide it without deleting it.</small>
                </label>
                <label className={styles.check}>
                  <input type="checkbox" name="is_new" defaultChecked={product?.is_new} />
                  <strong>New arrival</strong>
                  <small>“New” badge and the New arrivals filter.</small>
                </label>
                <label className={styles.check}>
                  <input type="checkbox" name="bestseller" defaultChecked={product?.bestseller} />
                  <strong>Best seller</strong>
                  <small>Shown in the homepage Signature Collection.</small>
                </label>
              </div>

              <div>
                <label htmlFor="pf-position" className={ui.label}>
                  Position
                </label>
                <input
                  id="pf-position"
                  name="sort_order"
                  inputMode="numeric"
                  defaultValue={product?.sort_order}
                  className={ui.input}
                  placeholder={creating ? "Last" : undefined}
                  aria-describedby="pf-position-hint"
                />
                <p id="pf-position-hint" className={styles.hint}>
                  Lower numbers come first in the shop (“Featured” order).
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SaveBar
        pending={pending}
        result={result}
        label={creating ? "Add watch" : "Save changes"}
        cancelHref="/admin/products"
      />
    </form>
  );
}
