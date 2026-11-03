import type { Metadata } from "next";
import styles from "@/components/admin/Admin.module.scss";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — WAQT Admin" },
  robots: { index: false, follow: false },
};

// Every admin page reads the session cookie, so there is no static shell to validate.
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
