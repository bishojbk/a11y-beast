// Renders one or more JSON-LD structured-data objects into the document.
// No hooks / no client state, so it works in both server and client components.
// The <script> is emitted in the SSR'd HTML, so crawlers and AI engines see it
// without executing any JavaScript.
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is build-time static (no user input), so this is safe.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
