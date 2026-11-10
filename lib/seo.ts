import type { Metadata } from "next";
import { isSoldOut, type Category, type Product } from "@/data/catalog";

// Shared search-engine and social metadata for the storefront.

export const SITE_NAME = "Zarvonique";

// The public origin, used for canonical URLs, the sitemap, robots.txt and structured data.
// Defaults to the Vercel production address. When a custom domain is connected, set
// NEXT_PUBLIC_SITE_URL in Vercel (or change this default) and redeploy.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://e-commerce-six-pi-26.vercel.app"
).replace(/\/$/, "");

export const HOME_TITLE = "Men's Watches in Pakistan — Free Delivery & COD | Zarvonique";

export const DEFAULT_DESCRIPTION =
  "Men's watches in Pakistan: automatic, chronograph, dress and diver watches with free delivery and cash on delivery.";

// 1200×630 brand card in /public, used whenever a page has no image of its own.
const DEFAULT_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME };

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

type PageSeo = {
  // Page title without the brand; the root layout's template adds " — Zarvonique".
  title?: string;
  // A full title that skips the template (the homepage).
  absoluteTitle?: string;
  description: string;
  // Path without query string. It becomes the canonical URL, so filtered and sorted variants
  // (?sort=, ?q=, ?filter=) all point search engines at one address.
  path: string;
  image?: string;
  type?: "website" | "article";
};

// Next merges metadata shallowly: a page that sets `openGraph` replaces the root's whole
// `openGraph` object. Building every page's tags here keeps og:title/description/url/image
// in step with the page instead of silently falling back to the homepage's.
export function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  image,
  type = "website",
}: PageSeo): Metadata {
  const fullTitle = absoluteTitle ?? `${title} — ${SITE_NAME}`;
  const images = image ? [{ url: image, alt: title ?? SITE_NAME }] : [DEFAULT_IMAGE];
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_PK",
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

// Bag, checkout, wishlist and order tracking: useful to visitors, worthless in search results.
// `follow` stays on so links out of these pages still count.
export function privateMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: true } };
}

// ---- Structured data (schema.org JSON-LD) ----

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/apple-icon.png"),
        image: absoluteUrl(DEFAULT_IMAGE.url),
        description: DEFAULT_DESCRIPTION,
        email: "zarvonique@gmail.com",
        areaServed: { "@type": "Country", name: "Pakistan" },
        currenciesAccepted: "PKR",
        paymentAccepted: "Cash, Bank transfer",
        // TODO: add `telephone` and `sameAs` (Instagram, Facebook, TikTok profile URLs) once
        // the real number and accounts exist. Placeholders here would mislead search engines.
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en-PK",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

// Free delivery anywhere in Pakistan in 5–7 working days (see data/help.ts "shipping").
const shippingDetails = {
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "PKR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 6, unitCode: "DAY" },
  },
};

// 7-day exchange or store credit, free courier pickup (see data/help.ts "returns").
const returnPolicy = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "PK",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
  refundType: ["https://schema.org/ExchangeRefund", "https://schema.org/StoreCreditRefund"],
};

export function productJsonLd(product: Product, category: Category) {
  const url = absoluteUrl(`/products/${product.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    sku: product.id,
    url,
    category: `Men's watches > ${category.name}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    additionalProperty: [
      ["Movement", product.specs.movement],
      ["Case size", product.specs.caseSize],
      ["Case material", product.specs.caseMaterial],
      ["Strap", product.specs.strap],
      ["Crystal", product.specs.glass],
      ["Water resistance", product.specs.waterResistance],
    ]
      .filter(([, value]) => value)
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "PKR",
      availability: isSoldOut(product)
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      shippingDetails,
      hasMerchantReturnPolicy: returnPolicy,
    },
  };
}

export function collectionJsonLd(category: Category, products: Product[]) {
  const url = absoluteUrl(`/shop/${category.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} watches for men`,
    description: category.description,
    url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/products/${p.id}`),
        name: p.name,
      })),
    },
  };
}

export function breadcrumbJsonLd(crumbs: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      // The current page (last crumb) has no link; Google allows the item to be omitted there.
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}
