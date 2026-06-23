// The shared content container for standard (non-full-bleed) pages. Gives every
// prose/content page the same width, padding, flex behaviour and the
// #main-content skip-link target. Full-bleed pages (home, results) and the wide
// pricing/tool pages keep their own <main> instead.
export default function PageContainer({
  children,
  maxWidth = 760,
}: {
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <main
      id="main-content"
      className="stagger-in"
      role="main"
      style={{ flex: 1, maxWidth, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}
    >
      {children}
    </main>
  );
}
