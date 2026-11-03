import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MessageCard } from "@/components/admin/messages/MessageCard";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";
import ui from "@/components/admin/Admin.module.scss";
import styles from "@/components/admin/messages/Messages.module.scss";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const showAll = (await searchParams).show === "all";
  const supabase = await createSessionClient();

  let query = supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (!showAll) query = query.eq("handled", false);
  const { data, error } = await query;
  const messages = data ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Customer care"
        title="Messages"
        subtitle="From the contact form. Reply by email or WhatsApp, then mark as handled."
      />

      <nav className={styles.tabs} aria-label="Filter messages">
        <Link
          href="/admin/messages"
          className={styles.tab}
          aria-current={!showAll ? "page" : undefined}
        >
          Open
        </Link>
        <Link
          href="/admin/messages?show=all"
          className={styles.tab}
          aria-current={showAll ? "page" : undefined}
        >
          All
        </Link>
      </nav>

      {error ? (
        <p className={ui.notice} role="alert">
          Couldn&apos;t load messages: {error.message}
        </p>
      ) : messages.length === 0 ? (
        <p className={ui.empty}>
          {showAll ? "No messages yet." : "Inbox zero — every message has been handled."}
        </p>
      ) : (
        <ul className={styles.list}>
          {messages.map((m) => (
            <li key={m.id}>
              <MessageCard message={m} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
