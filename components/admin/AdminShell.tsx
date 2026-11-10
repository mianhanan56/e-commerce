import { Suspense } from "react";
import { Logo } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import type { Admin } from "@/lib/admin/auth";
import { signOut } from "@/lib/actions/admin";
import { AdminNav, AdminNavFallback } from "./AdminNav";
import styles from "./AdminShell.module.scss";

export function AdminShell({ admin, children }: { admin: Admin; children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo surface="dark" />
          <span className={styles.badge}>Admin</span>
        </div>
        <Suspense fallback={<AdminNavFallback />}>
          <AdminNav />
        </Suspense>
        <div className={styles.account}>
          <p className={styles.who}>
            {admin.name || admin.email}
            <span>
              {admin.role === "owner" ? "Owner" : "Staff"} · {admin.email}
            </span>
          </p>
          <div className={styles.accountActions}>
            <a href="/" target="_blank" rel="noopener noreferrer" className={styles.storeLink}>
              View store <Icon name="arrow" size={14} />
            </a>
            <form action={signOut}>
              <button type="submit" className={styles.signOut}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
