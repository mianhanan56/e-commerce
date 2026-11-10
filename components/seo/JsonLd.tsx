// Structured data for search engines. A plain <script> (not next/script): it is data, not code.
// `<` is escaped so text from the catalogue can never close the tag early.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
