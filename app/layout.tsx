import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { DEFAULT_DESCRIPTION, HOME_TITLE, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  // SITE_URL (lib/seo.ts): the Vercel address unless NEXT_PUBLIC_SITE_URL overrides it.
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: HOME_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  // Defaults for pages without their own (the 404). Store pages set theirs via pageMetadata().
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_PK",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (dark mode, translators) add attributes to <html> before hydration.
    // This only silences attribute mismatches on this one element, not its children.
    <html lang="en-PK" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
