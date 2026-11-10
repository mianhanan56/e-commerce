import Link from "next/link";
import { formatDateTime, formatPhone, whatsappLink } from "@/lib/orders";
import type { ContactMessageRow } from "@/lib/supabase/types";
import ui from "../Admin.module.scss";
import { HandledToggle } from "./HandledToggle";
import styles from "./Messages.module.scss";

export function MessageCard({ message: m }: { message: ContactMessageRow }) {
  const reply = `mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Zarvonique")}`;

  return (
    <article className={`${ui.card} ${m.handled ? styles.handled : ""}`}>
      <header className={styles.head}>
        <div>
          <h2 className={styles.name}>{m.name}</h2>
          <p className={styles.meta}>
            <span className={ui.badge}>{m.topic}</span>
            <time dateTime={m.created_at}>{formatDateTime(m.created_at)}</time>
            {m.handled && <span className={`${ui.badge} ${ui.delivered}`}>Handled</span>}
          </p>
        </div>
        <HandledToggle id={m.id} handled={m.handled} />
      </header>

      <p className={styles.body}>{m.message}</p>

      <ul className={styles.contact}>
        <li>
          <a href={reply} className={ui.link}>
            {m.email}
          </a>
        </li>
        {m.phone && (
          <>
            <li>
              <a href={`tel:${m.phone}`} className={ui.link}>
                {formatPhone(m.phone)}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(m.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className={ui.link}
              >
                WhatsApp
              </a>
            </li>
          </>
        )}
        {m.order_number && (
          <li>
            Order{" "}
            <Link
              href={`/admin/orders?q=${encodeURIComponent(m.order_number)}`}
              className={ui.link}
            >
              {m.order_number}
            </Link>
          </li>
        )}
      </ul>
    </article>
  );
}
