import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import { Icon } from "@/components/ui/Icon";
import { requireAdmin } from "@/lib/admin/auth";
import styles from "@/components/admin/catalog/CatalogForm.module.scss";

export const metadata: Metadata = { title: "Add collection" };

export default async function NewCollectionPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/collections" className={styles.back}>
        <Icon name="arrow" size={14} className={styles.backIcon} /> All collections
      </Link>
      <AdminPageHeader eyebrow="Catalogue" title="Add a collection" />
      <CollectionForm />
    </>
  );
}
