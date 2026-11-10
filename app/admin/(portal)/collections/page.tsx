import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionsTable } from "@/components/admin/collections/CollectionsTable";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = { title: "Collections" };

export default async function AdminCollectionsPage({
  searchParams,
}: PageProps<"/admin/collections">) {
  await requireAdmin();
  const { added, deleted } = await searchParams;
  const supabase = await createSessionClient();
  const [categoriesRes, productsRes] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name, image, sort_order")
      .order("sort_order")
      .order("name"),
    supabase.from("products").select("category, active"),
  ]);

  const error = categoriesRes.error ?? productsRes.error;
  const products = productsRes.data ?? [];
  const collections = (categoriesRes.data ?? []).map((c) => {
    const inside = products.filter((p) => p.category === c.slug);
    return { ...c, total: inside.length, live: inside.filter((p) => p.active).length };
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Collections"
        subtitle={error ? undefined : `${collections.length} collections`}
        actions={
          <Link href="/admin/collections/new" className={ui.btn}>
            <Icon name="plus" size={16} /> Add collection
          </Link>
        }
      />
      <div className={ui.grid}>
        {typeof added === "string" && (
          <p className={ui.flash} role="status">
            Collection added.{" "}
            <Link href={`/admin/products/new?collection=${added}`} className={ui.link}>
              Add a watch to it
            </Link>
            .
          </p>
        )}
        {typeof deleted === "string" && (
          <p className={ui.flash} role="status">
            Deleted the “{deleted}” collection.
          </p>
        )}
        {error ? (
          <p className={ui.notice} role="alert">
            Couldn&apos;t load collections: {error.message}
          </p>
        ) : collections.length === 0 ? (
          <p className={ui.empty}>
            No collections yet.{" "}
            <Link href="/admin/collections/new" className={ui.link}>
              Add the first one
            </Link>
            .
          </p>
        ) : (
          <CollectionsTable collections={collections} />
        )}
      </div>
    </>
  );
}
