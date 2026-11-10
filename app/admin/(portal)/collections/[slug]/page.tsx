import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/catalog/DeleteButton";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { Icon } from "@/components/ui/Icon";
import { collectionHref } from "@/data/catalog";
import { deleteCategory } from "@/lib/actions/catalog";
import { requireAdmin } from "@/lib/admin/auth";
import { SLUG_PATTERN } from "@/lib/admin/catalog-fields";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/catalog/CatalogForm.module.scss";

export const metadata: Metadata = { title: "Edit collection" };

export default async function EditCollectionPage({
  params,
}: PageProps<"/admin/collections/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) notFound();

  const supabase = await createSessionClient();
  const [categoryRes, countRes] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("category", slug),
  ]);

  if (categoryRes.error) {
    return (
      <>
        <AdminPageHeader eyebrow="Catalogue" title="Edit collection" />
        <p className={ui.notice} role="alert">
          Couldn&apos;t load this collection: {categoryRes.error.message}
        </p>
      </>
    );
  }
  const category = categoryRes.data;
  if (!category) notFound();
  const count = countRes.count ?? 0;

  return (
    <>
      <Link href="/admin/collections" className={styles.back}>
        <Icon name="arrow" size={14} className={styles.backIcon} /> All collections
      </Link>
      <AdminPageHeader
        eyebrow="Catalogue"
        title={category.name}
        subtitle={`${count} ${count === 1 ? "watch" : "watches"}`}
        actions={
          <a
            href={collectionHref(category.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ui.btn} ${ui.btnGhost}`}
          >
            View in store <Icon name="arrow" size={14} />
          </a>
        }
      />
      <div className={ui.grid}>
        <CollectionForm category={category} />

        <section className={`${ui.card} ${styles.danger}`} aria-labelledby="delete-title">
          <h2 id="delete-title" className={ui.cardTitle}>
            Delete collection
          </h2>
          <p>
            {count
              ? `Move or delete its ${count} ${count === 1 ? "watch" : "watches"} first: every watch must belong to a collection.`
              : "This collection is empty, so it can be deleted."}
          </p>
          <DeleteButton
            action={deleteCategory.bind(null, category.slug)}
            label="Delete collection"
            confirm={`Delete the “${category.name}” collection permanently? This can't be undone.`}
          />
        </section>
      </div>
    </>
  );
}
