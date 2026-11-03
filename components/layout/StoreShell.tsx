import { CartProvider } from "@/components/cart/CartContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Storefront chrome and client state. Used by the (store) layout and the root 404 page,
// but not by /admin.
export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </CartProvider>
  );
}
