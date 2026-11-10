"use client";

import { useState } from "react";
import { ImageField } from "@/components/admin/catalog/ImageField";
import { SaveBar, useCatalogSave } from "@/components/admin/catalog/SaveBar";
import { saveCategory } from "@/lib/actions/catalog";
import { slugify } from "@/lib/admin/catalog-fields";
import type { CategoryRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import styles from "../catalog/CatalogForm.module.scss";

export function CollectionForm({ category }: { category?: CategoryRow }) {
  const creating = !category;
  const { pending, result, onSubmit } = useCatalogSave(saveCategory);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const image = result?.ok ? result.image : (category?.image ?? "");

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <input type="hidden" name="mode" value={creating ? "create" : "edit"} />

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={ui.card} aria-labelledby="cf-details">
            <h2 id="cf-details" className={ui.cardTitle}>
              Details
            </h2>
            <div className={styles.fields}>
              <div>
                <label htmlFor="cf-name" className={ui.label}>
                  Collection name
                </label>
                <input
                  id="cf-name"
                  name="name"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (creating && !slugTouched) setSlug(slugify(e.target.value));
                  }}
                  className={ui.input}
                  placeholder="e.g. Luxury"
                  aria-describedby="cf-name-hint"
                />
                <p id="cf-name-hint" className={styles.hint}>
                  The store adds “Watches” after it, e.g. “Luxury Watches”.
                </p>
              </div>

              <div>
                <label htmlFor="cf-slug" className={ui.label}>
                  Web address
                </label>
                <div className={styles.prefixed}>
                  <span>/shop?category=</span>
                  <input
                    id="cf-slug"
                    name="slug"
                    required
                    maxLength={60}
                    value={slug}
                    readOnly={!creating}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, ""),
                      );
                    }}
                    className={[ui.input, !creating && styles.readonly].filter(Boolean).join(" ")}
                    aria-describedby="cf-slug-hint"
                  />
                </div>
                <p id="cf-slug-hint" className={styles.hint}>
                  {creating
                    ? "Lowercase letters, numbers and dashes. It can't be changed later."
                    : "The web address can't change, so links people have shared keep working."}
                </p>
              </div>

              <div>
                <label htmlFor="cf-description" className={ui.label}>
                  Short description
                </label>
                <input
                  id="cf-description"
                  name="description"
                  maxLength={300}
                  defaultValue={category?.description}
                  className={ui.input}
                  placeholder="e.g. Precious finishes for the moments that count."
                  aria-describedby="cf-description-hint"
                />
                <p id="cf-description-hint" className={styles.hint}>
                  One line, shown on the homepage collection cards.
                </p>
              </div>

              <div>
                <label htmlFor="cf-story" className={ui.label}>
                  Story
                </label>
                <textarea
                  id="cf-story"
                  name="story"
                  maxLength={2000}
                  rows={5}
                  defaultValue={category?.story}
                  className={ui.textarea}
                  aria-describedby="cf-story-hint"
                />
                <p id="cf-story-hint" className={styles.hint}>
                  A short paragraph for the top of the collection page.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.side}>
          <section className={ui.card} aria-labelledby="cf-photo">
            <h2 id="cf-photo" className={ui.cardTitle}>
              Photo
            </h2>
            <ImageField key={image} value={image} label={name || "Collection photo"} wide />
          </section>

          <section className={ui.card} aria-labelledby="cf-order">
            <h2 id="cf-order" className={ui.cardTitle}>
              Store
            </h2>
            <label htmlFor="cf-position" className={ui.label}>
              Position
            </label>
            <input
              id="cf-position"
              name="sort_order"
              inputMode="numeric"
              defaultValue={category?.sort_order}
              className={ui.input}
              placeholder={creating ? "Last" : undefined}
              aria-describedby="cf-position-hint"
            />
            <p id="cf-position-hint" className={styles.hint}>
              Lower numbers come first in menus and on the homepage.
            </p>
          </section>
        </div>
      </div>

      <SaveBar
        pending={pending}
        result={result}
        label={creating ? "Add collection" : "Save changes"}
        cancelHref="/admin/collections"
      />
    </form>
  );
}
