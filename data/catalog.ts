// Collections are managed in the admin portal, so slugs are open-ended.
export type CategorySlug = string;

export type Product = {
  id: string;
  name: string;
  line: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: CategorySlug;
  description: string;
  specs: {
    movement: string;
    caseSize: string;
    caseMaterial: string;
    strap: string;
    glass: string;
    waterResistance: string;
  };
  isNew?: boolean;
  bestseller?: boolean;
  /** Units left; undefined when unknown (the offline sample catalogue). */
  stock?: number;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  story: string;
  image: string;
};

export type Catalog = { products: Product[]; categories: Category[] };

// Sample catalogue (same as supabase/seed.sql). The store only shows it when Supabase isn't
// configured; otherwise products and collections come from the database (lib/catalog.ts).
export const sampleProducts: Product[] = [
  {
    id: "noir-automatic",
    name: "Noir Automatic",
    line: "Steel · 40mm",
    image: "/images/p-noir.jpg",
    price: 38500,
    originalPrice: 45000,
    category: "business",
    bestseller: true,
    description:
      "A black sunray dial, polished applied indices and a steel bracelet that tapers neatly at the clasp. The Noir is the watch you stop noticing until someone asks about it.",
    specs: {
      movement: "Automatic, 42-hour reserve",
      caseSize: "40mm × 11.8mm",
      caseMaterial: "316L stainless steel",
      strap: "Steel bracelet, butterfly clasp",
      glass: "Sapphire-coated mineral",
      waterResistance: "100m",
    },
  },
  {
    id: "marine-heritage",
    name: "Marine Heritage",
    line: "Navy leather · 41mm",
    image: "/images/p-marine.jpg",
    price: 29900,
    category: "classic",
    bestseller: true,
    description:
      "Deep navy dial, rose-gold hands and a croc-grain leather strap. A dress watch with enough colour to wear with denim on the weekend.",
    specs: {
      movement: "Japanese quartz",
      caseSize: "41mm × 9.5mm",
      caseMaterial: "Rose-gold PVD steel",
      strap: "Navy croc-grain leather",
      glass: "Sapphire-coated mineral",
      waterResistance: "50m",
    },
  },
  {
    id: "panda-chronograph",
    name: "Panda Chronograph",
    line: "Calfskin · 39mm",
    image: "/images/p-panda.jpg",
    price: 34500,
    originalPrice: 41000,
    category: "classic",
    bestseller: true,
    description:
      "The racing chronograph that never went out of style: cream dial, black sub-dials and a tachymeter bezel, on a soft brown calfskin strap.",
    specs: {
      movement: "Quartz chronograph",
      caseSize: "39mm × 12mm",
      caseMaterial: "316L stainless steel",
      strap: "Brown calfskin leather",
      glass: "Sapphire crystal",
      waterResistance: "50m",
    },
  },
  {
    id: "abyss-diver",
    name: "Abyss Diver 300",
    line: "Oyster steel · 42mm",
    image: "/images/p-abyss.jpg",
    price: 52000,
    category: "sports",
    bestseller: true,
    description:
      "A professional-spec diver with a unidirectional ceramic bezel, generous lume and a screw-down crown. Rated to 300 metres; happiest at the pool or the office.",
    specs: {
      movement: "Automatic, 41-hour reserve",
      caseSize: "42mm × 13.5mm",
      caseMaterial: "316L stainless steel",
      strap: "Oyster-style steel bracelet",
      glass: "Sapphire crystal",
      waterResistance: "300m",
    },
  },
  {
    id: "regent-two-tone",
    name: "Regent Two-Tone",
    line: "Jubilee bracelet · 36mm",
    image: "/images/p-regent.jpg",
    price: 47500,
    originalPrice: 55000,
    category: "luxury",
    bestseller: true,
    description:
      "Gold and steel, a fluted bezel and a chocolate dial set with diamond-cut markers. A wedding-season watch that earns its place the rest of the year.",
    specs: {
      movement: "Automatic, 40-hour reserve",
      caseSize: "36mm × 11mm",
      caseMaterial: "Two-tone steel, gold PVD",
      strap: "Five-link jubilee bracelet",
      glass: "Sapphire crystal",
      waterResistance: "100m",
    },
  },
  {
    id: "field-chrono",
    name: "Field Chronograph",
    line: "Gunmetal · 44mm",
    image: "/images/p-field.jpg",
    price: 24900,
    category: "sports",
    bestseller: true,
    description:
      "Gunmetal case, textured dial and copper accents. A big, honest tool watch for the drive north and the long weekend after it.",
    specs: {
      movement: "Quartz chronograph",
      caseSize: "44mm × 12.5mm",
      caseMaterial: "Gunmetal-plated steel",
      strap: "Mesh steel bracelet",
      glass: "Mineral crystal",
      waterResistance: "100m",
    },
  },
  {
    id: "coastline",
    name: "Coastline",
    line: "Sky blue strap · 40mm",
    image: "/images/p-coast.jpg",
    price: 19500,
    originalPrice: 23000,
    category: "minimalist",
    bestseller: true,
    description:
      "A crisp white dial with Arabic twelve, a date at three and a sky-blue rubberised leather strap. Summer, distilled.",
    specs: {
      movement: "Automatic, 38-hour reserve",
      caseSize: "40mm × 10.5mm",
      caseMaterial: "Brushed stainless steel",
      strap: "Sky blue rubberised leather",
      glass: "Sapphire-coated mineral",
      waterResistance: "50m",
    },
  },
  {
    id: "midnight-dress",
    name: "Midnight Dress",
    line: "Black leather · 38mm",
    image: "/images/p-midnight.jpg",
    price: 27500,
    category: "business",
    bestseller: true,
    description:
      "Black dial, black leather, a slim polished case. Midnight slips under a shirt cuff and stays there — exactly what a dress watch should do.",
    specs: {
      movement: "Japanese quartz",
      caseSize: "38mm × 8.2mm",
      caseMaterial: "Polished stainless steel",
      strap: "Black Italian leather",
      glass: "Sapphire-coated mineral",
      waterResistance: "30m",
    },
  },
  {
    id: "sovereign-gold",
    name: "Sovereign Gold",
    line: "Gold bracelet · 40mm",
    image: "/images/hero-gold.jpg",
    price: 64500,
    category: "luxury",
    isNew: true,
    description:
      "Our flagship. A champagne dial, fluted bezel and an integrated gold bracelet with a hidden clasp. Made for the moments people photograph.",
    specs: {
      movement: "Automatic, 42-hour reserve",
      caseSize: "40mm × 11.5mm",
      caseMaterial: "Gold PVD steel",
      strap: "Integrated gold bracelet",
      glass: "Sapphire crystal",
      waterResistance: "100m",
    },
  },
  {
    id: "atlas-gmt",
    name: "Atlas GMT",
    line: "Black bezel · 41mm",
    image: "/images/c-luxury.jpg",
    price: 58000,
    originalPrice: 64000,
    category: "luxury",
    isNew: true,
    description:
      "A second time zone on a 24-hour ceramic bezel, for the man who lives between Lahore, Dubai and London. Black, steel and quietly technical.",
    specs: {
      movement: "Automatic GMT, 42-hour reserve",
      caseSize: "41mm × 12.5mm",
      caseMaterial: "316L stainless steel",
      strap: "Oyster-style steel bracelet",
      glass: "Sapphire crystal",
      waterResistance: "200m",
    },
  },
  {
    id: "heritage-leather",
    name: "Heritage Leather",
    line: "Brown leather · 40mm",
    image: "/images/c-classic.jpg",
    price: 26500,
    category: "classic",
    isNew: true,
    description:
      "A silver-white dial, dauphine hands and a dark-brown leather strap that softens with every wear. The watch your father would recognise.",
    specs: {
      movement: "Japanese quartz",
      caseSize: "40mm × 9.8mm",
      caseMaterial: "Polished stainless steel",
      strap: "Dark brown leather",
      glass: "Sapphire-coated mineral",
      waterResistance: "50m",
    },
  },
  {
    id: "lune",
    name: "Lune",
    line: "Taupe suede · 38mm",
    image: "/images/c-minimal.jpg",
    price: 17500,
    category: "minimalist",
    isNew: true,
    description:
      "Two hands, twelve hairline markers and nothing else. A 38mm steel case on a taupe suede strap — the lightest watch we sell.",
    specs: {
      movement: "Swiss quartz",
      caseSize: "38mm × 7.5mm",
      caseMaterial: "Brushed stainless steel",
      strap: "Taupe suede",
      glass: "Sapphire crystal",
      waterResistance: "30m",
    },
  },
  {
    id: "nordic-slim",
    name: "Nordic Slim",
    line: "Tan leather · 40mm",
    image: "/images/why-minimal.jpg",
    price: 21000,
    originalPrice: 24500,
    category: "minimalist",
    description:
      "A Scandinavian-inspired white dial with a slim silver case and tan leather strap. Clean enough for a suit, relaxed enough for a kurta.",
    specs: {
      movement: "Japanese quartz",
      caseSize: "40mm × 7.8mm",
      caseMaterial: "Polished stainless steel",
      strap: "Tan Italian leather",
      glass: "Sapphire-coated mineral",
      waterResistance: "30m",
    },
  },
  {
    id: "bordeaux-automatic",
    name: "Bordeaux Automatic",
    line: "Slate dial · 39mm",
    image: "/images/c-business.jpg",
    price: 42000,
    category: "business",
    isNew: true,
    description:
      "A slate-grey sunburst dial, a slim fluted bezel and a three-link bracelet. Quiet authority, from the boardroom to dinner afterwards.",
    specs: {
      movement: "Automatic, 42-hour reserve",
      caseSize: "39mm × 11mm",
      caseMaterial: "316L stainless steel",
      strap: "Three-link steel bracelet",
      glass: "Sapphire crystal",
      waterResistance: "100m",
    },
  },
  {
    id: "apex-chronograph",
    name: "Apex Chronograph",
    line: "Ceramic bezel · 43mm",
    image: "/images/c-sports.jpg",
    price: 49500,
    category: "sports",
    isNew: true,
    description:
      "Grey dial, orange accents and a ceramic tachymeter bezel. Built for speed — and for the stopwatch you'll actually use at the nets.",
    specs: {
      movement: "Automatic chronograph",
      caseSize: "43mm × 14mm",
      caseMaterial: "316L stainless steel",
      strap: "Steel bracelet, fold-over clasp",
      glass: "Sapphire crystal",
      waterResistance: "100m",
    },
  },
];

export const sampleCategories: Category[] = [
  {
    slug: "luxury",
    name: "Luxury",
    description: "Precious finishes and complications for the moments that count.",
    story:
      "Gold, ceramic and sapphire. Our luxury pieces are made for the nikkah, the promotion and the anniversary — the days you'll want to remember what you were wearing.",
    image: "/images/c-luxury.jpg",
  },
  {
    slug: "classic",
    name: "Classic",
    description: "Leather straps and clean dials that never date.",
    story:
      "Proportions borrowed from the mid-century and straps that age with you. Classic watches are the ones that look as right in thirty years as they do today.",
    image: "/images/c-classic.jpg",
  },
  {
    slug: "minimalist",
    name: "Minimalist",
    description: "Nothing extra. Only the hours that matter.",
    story:
      "Slim cases, quiet dials and nothing to distract. For the man who would rather be asked about his watch than announce it.",
    image: "/images/c-minimal.jpg",
  },
  {
    slug: "business",
    name: "Business",
    description: "Quiet authority from boardroom to dinner.",
    story:
      "Steel bracelets, dark dials and cases slim enough for a French cuff. Business watches are built to be worn every working day for a decade.",
    image: "/images/c-business.jpg",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Built for depth, speed and the long weekend.",
    story:
      "Divers, chronographs and GMTs with real water resistance and legible dials. Made to be knocked about, rinsed off and worn again.",
    image: "/images/c-sports.jpg",
  },
];

export function productsInCategory(products: Product[], slug: CategorySlug) {
  return products.filter((p) => p.category === slug);
}

export function relatedProducts(products: Product[], product: Product, count = 4) {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const others = products.filter((p) => p.category !== product.category);
  return [...same, ...others].slice(0, count);
}

export function searchProducts(products: Product[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.line, p.category, p.specs.movement, p.specs.strap]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function isSoldOut(p: Product) {
  return p.stock === 0;
}

const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatPKR(value: number) {
  return `Rs ${pkr.format(value)}`;
}

export function discountPercent(p: Product) {
  if (!p.originalPrice) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

// "01", "02"… for collection numbering.
// Collections have no page of their own: a collection is the shop filtered to it.
export function collectionHref(slug: string) {
  return `/shop?category=${encodeURIComponent(slug)}`;
}

export function ordinal(index: number) {
  return String(index + 1).padStart(2, "0");
}
