export type HelpBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "faq"; items: { q: string; a: string }[] };

export type HelpPage = {
  slug: string;
  title: string;
  nav: string;
  intro: string;
  updated?: string;
  blocks: HelpBlock[];
};

export const faqs: { q: string; a: string }[] = [
  {
    q: "How long does delivery take?",
    a: "Orders arrive within 5–7 working days, anywhere in Pakistan. Delivery is always free.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes. Cash on delivery is available nationwide with no extra charge. You can also pay by bank transfer if you prefer.",
  },
  {
    q: "Are your watches authentic and new?",
    a: "Every watch is brand new, sealed and inspected by hand in our Lahore studio before dispatch. Each one ships with a Zarvonique warranty card and box.",
  },
  {
    q: "Can I open the parcel before paying?",
    a: "Courier policy does not allow parcels to be opened before payment. If anything is wrong when you open it, message us within 48 hours and we will put it right.",
  },
  {
    q: "What if the watch doesn't suit me?",
    a: "You have 7 days from delivery to exchange an unworn watch for another model or store credit. See Returns & Exchanges for details.",
  },
  {
    q: "Do you resize steel bracelets?",
    a: "Yes — tell us your wrist size in the order notes and we will remove links before dispatch, free of charge. Spare links are included in the box.",
  },
  {
    q: "What does the warranty cover?",
    a: "One year on the movement against manufacturing defects. Glass, straps and damage from knocks or water beyond the rated resistance are not covered.",
  },
  {
    q: "Do you offer gift wrapping or corporate orders?",
    a: "Every watch arrives in our signature box. For gift notes or corporate orders of five or more pieces, contact us and we will arrange it.",
  },
];

export const helpPages: HelpPage[] = [
  {
    slug: "shipping",
    title: "Shipping & Delivery",
    nav: "Shipping & Delivery",
    intro: "Complimentary, insured delivery to more than 120 cities across Pakistan.",
    blocks: [
      { type: "h", text: "Delivery times" },
      {
        type: "table",
        head: ["Destination", "Estimated time", "Cost"],
        rows: [["Anywhere in Pakistan", "5–7 working days", "Free"]],
      },
      {
        type: "p",
        text: "Orders placed before 3pm Monday to Saturday are dispatched the same day. Orders placed later, or on Sundays and public holidays, are dispatched the next working day.",
      },
      { type: "h", text: "How it works" },
      {
        type: "list",
        items: [
          "We call or WhatsApp you to confirm every cash-on-delivery order before dispatch.",
          "Once shipped, you receive a tracking number by SMS and email.",
          "Every parcel is insured in transit and sealed with a tamper-evident strip.",
          "If you are not home, the courier will attempt delivery twice before returning the parcel to us.",
        ],
      },
      { type: "h", text: "Payment" },
      {
        type: "p",
        text: "Pay in cash when your watch arrives, or by bank transfer before dispatch. Please keep the exact amount ready — couriers often cannot give change for large notes.",
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Exchanges",
    nav: "Returns & Exchanges",
    intro: "Seven days to be sure. If it isn't right, we'll make it right.",
    blocks: [
      { type: "h", text: "7-day exchange" },
      {
        type: "p",
        text: "You can exchange any watch within 7 days of delivery for another model or Zarvonique store credit. If you choose a more expensive watch, simply pay the difference.",
      },
      { type: "h", text: "Conditions" },
      {
        type: "list",
        items: [
          "The watch must be unworn, with protective films and tags still attached.",
          "Return it in the original box with the warranty card and any spare links.",
          "Bracelets that have been resized can still be exchanged — keep all removed links.",
          "Sale items can be exchanged but not refunded.",
        ],
      },
      { type: "h", text: "Damaged or incorrect items" },
      {
        type: "p",
        text: "If your watch arrives damaged or isn't what you ordered, message us within 48 hours of delivery with a photo. We collect it at our cost and send the correct piece, or refund you in full.",
      },
      { type: "h", text: "How to start an exchange" },
      {
        type: "list",
        items: [
          "WhatsApp or email us with your order number and the watch you'd like instead.",
          "We arrange a free courier pickup from your address.",
          "Your new watch is dispatched as soon as the original reaches our studio.",
        ],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty",
    nav: "Warranty",
    intro: "Every Zarvonique watch carries a one-year warranty on its movement.",
    blocks: [
      { type: "h", text: "What's covered" },
      {
        type: "list",
        items: [
          "Defects in the movement — quartz or automatic — for 12 months from delivery.",
          "Crown and pusher failures caused by manufacturing faults.",
          "A free battery replacement for quartz watches during the warranty year.",
        ],
      },
      { type: "h", text: "What isn't covered" },
      {
        type: "list",
        items: [
          "Glass, straps, bracelets and normal wear such as scratches.",
          "Damage from knocks, drops or water exposure beyond the stated water resistance.",
          "Watches opened or repaired by anyone other than Zarvonique.",
        ],
      },
      { type: "h", text: "Making a claim" },
      {
        type: "p",
        text: "Contact us with your order number and a short description of the problem. Lahore clients can drop the watch at our Gulberg studio; elsewhere we arrange a free courier pickup. Most repairs are completed within 10 working days.",
      },
      { type: "h", text: "After the warranty" },
      {
        type: "p",
        text: "We service every watch we sell, for life, at cost. Battery changes, strap fitting and pressure testing are available at the studio while you wait.",
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size & Fit Guide",
    nav: "Size & Fit Guide",
    intro: "The right case size matters more than the right brand. Here's how to find yours.",
    blocks: [
      { type: "h", text: "How to measure your wrist" },
      {
        type: "list",
        items: [
          "Wrap a soft tape measure — or a strip of paper — around your wrist just above the wrist bone.",
          "Keep it snug but not tight, and note where it overlaps.",
          "Measure the paper against a ruler. That's your wrist circumference.",
        ],
      },
      { type: "h", text: "Wrist size to case size" },
      {
        type: "table",
        head: ["Wrist circumference", "Recommended case", "Our suggestions"],
        rows: [
          ["Under 16cm", "34–38mm", "Regent Two-Tone, Lune, Midnight Dress"],
          ["16–17.5cm", "38–40mm", "Noir Automatic, Coastline, Heritage Leather"],
          ["17.5–19cm", "40–42mm", "Marine Heritage, Atlas GMT, Abyss Diver 300"],
          ["Over 19cm", "42–44mm", "Apex Chronograph, Field Chronograph"],
        ],
      },
      { type: "h", text: "Lug-to-lug matters too" },
      {
        type: "p",
        text: "Case diameter is only half the story. The distance from the tip of the top lug to the tip of the bottom lug decides whether a watch sits on your wrist or overhangs it. As a rule, lug-to-lug should not exceed the flat top width of your wrist.",
      },
      { type: "h", text: "Thickness and shirt cuffs" },
      {
        type: "p",
        text: "Dress watches under 10mm slip comfortably under a French cuff. Divers and chronographs at 12–14mm are better with a rolled sleeve or a kurta.",
      },
      { type: "h", text: "Bracelet sizing" },
      {
        type: "p",
        text: "Add your wrist measurement to the order notes and we will size steel bracelets before dispatch, free of charge. Leather straps fit wrists from roughly 15 to 20cm.",
      },
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    nav: "FAQs",
    intro: "Quick answers on delivery, payment, exchanges and care.",
    blocks: [{ type: "faq", items: faqs }],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    nav: "Privacy Policy",
    intro: "What we collect, why we collect it and how we keep it safe.",
    updated: "1 November 2026",
    blocks: [
      { type: "h", text: "Information we collect" },
      {
        type: "p",
        text: "When you place an order we collect your name, phone number, email and delivery address. If you subscribe to our newsletter we store your email. We do not store card details.",
      },
      { type: "h", text: "How we use it" },
      {
        type: "list",
        items: [
          "To confirm, deliver and support your orders.",
          "To send the Zarvonique Letter, if you subscribed — once a month at most.",
          "To improve our store, using anonymised analytics.",
        ],
      },
      { type: "h", text: "Sharing" },
      {
        type: "p",
        text: "We share your name, phone and address only with our courier partners, and only to deliver your order. We never sell your information.",
      },
      { type: "h", text: "Your choices" },
      {
        type: "p",
        text: "You can unsubscribe from emails at any time, and you can ask us to correct or delete your personal information by writing to zarvonique@gmail.com.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    nav: "Terms of Service",
    intro: "The terms that apply when you shop with Zarvonique.",
    updated: "1 November 2026",
    blocks: [
      { type: "h", text: "Orders" },
      {
        type: "p",
        text: "An order is confirmed once we have verified it by phone or WhatsApp. We may cancel orders we cannot verify, or where a price was displayed in error, and will refund any payment received.",
      },
      { type: "h", text: "Prices" },
      {
        type: "p",
        text: "All prices are in Pakistani Rupees and include applicable taxes. Delivery within Pakistan is free. Prices and availability may change without notice.",
      },
      { type: "h", text: "Exchanges and warranty" },
      {
        type: "p",
        text: "Exchanges are governed by our Returns & Exchanges policy and repairs by our Warranty terms. These do not affect your statutory rights under Pakistani consumer law.",
      },
      { type: "h", text: "Governing law" },
      {
        type: "p",
        text: "These terms are governed by the laws of Pakistan, and any disputes fall under the jurisdiction of the courts of Lahore.",
      },
    ],
  },
];

export function getHelpPage(slug: string) {
  return helpPages.find((p) => p.slug === slug);
}
