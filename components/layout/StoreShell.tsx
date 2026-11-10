import { CartProvider } from "@/components/cart/CartContext";
import { CatalogProvider } from "@/components/catalog/CatalogContext";
import { getCatalog } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Storefront chrome and client state. Used by the (store) layout and the root 404 page,
// but not by /admin.
export async function StoreShell({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();
  return (
    <CatalogProvider catalog={catalog}>
      <CartProvider>
        <AnnouncementBar />
        <Header />
        <main id="main">{children}</main>
        <Footer categories={catalog.categories} />
      </CartProvider>
    </CatalogProvider>
  );
}
