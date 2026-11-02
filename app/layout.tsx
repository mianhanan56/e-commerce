import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartProvider } from "@/components/cart/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OrdersProvider } from "@/components/orders/OrdersContext";
import "./globals.scss";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  // Placeholder domain — set to the production URL before launch.
  metadataBase: new URL("https://waqt.pk"),
  title: {
    default: "WAQT — Men's Watches, Pakistan",
    template: "%s — WAQT",
  },
  description:
    "Timeless men's watches with complimentary delivery across Pakistan and cash on delivery.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <OrdersProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </CartProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
