import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
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
    // Browser extensions (dark mode, translators) add attributes to <html> before hydration.
    // This only silences attribute mismatches on this one element, not its children.
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
