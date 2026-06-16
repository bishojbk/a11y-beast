import { Plus } from "lucide-react";

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is it really free?",
    a: "Yes — single-page scans with all 16-framework legal mapping are free forever, no signup. On paste or upload your HTML never leaves your browser. Paid tiers add site-wide crawls, legal-report exports, and scale.",
  },
  {
    q: "Do you guarantee my site is ADA / WCAG compliant?",
    a: "No — and be wary of any tool that does. The FTC fined an overlay vendor $1M in 2025 for exactly that claim. Automated testing covers only ~30–40% of WCAG criteria, so we report automated indicators mapped to legal risk, not a conformance verdict. Full conformance needs manual review.",
  },
  {
    q: "Isn't this just another accessibility overlay widget?",
    a: "No. We don't inject a script that claims to “fix” your site. We render your real page in a browser, find the issues, map each to the laws it implicates, and hand you the code to fix them. Overlays don't stop lawsuits — over a thousand sites running one were still sued in 2025.",
  },
  {
    q: "What does “founding price” mean?",
    a: "Join the Pro or Agency waitlist now and you lock in today's price for life. As roadmap features land — scheduled monitoring, white-label reports, the public API — your rate stays the same.",
  },
  {
    q: "Annual or monthly?",
    a: "Either. Annual billing is two months free (about 17% off) and you can switch any time.",
  },
  {
    q: "Can I run it in CI?",
    a: "Yes, on every tier including Free — the CLI and GitHub Action let you fail a build on new violations.",
  },
];

export default function PricingFaq() {
  return (
    <section aria-labelledby="faq-heading" style={{ marginTop: 72, maxWidth: 760, marginInline: "auto" }}>
      <h2 id="faq-heading" className="font-display" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", textAlign: "center", marginBottom: 28 }}>
        Questions
      </h2>
      <div style={{ border: "1px solid var(--border-default)", borderRadius: 6, overflow: "hidden" }}>
        {FAQ.map((item, i) => (
          <details
            key={item.q}
            style={{ borderTop: i === 0 ? "none" : "1px solid var(--border-faint)" }}
          >
            <summary
              style={{
                listStyle: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "16px 18px",
                fontSize: 15,
                color: "var(--text-primary)",
              }}
            >
              <span className="font-display">{item.q}</span>
              <Plus size={16} aria-hidden="true" className="faq-icon" style={{ flexShrink: 0, color: "var(--text-tertiary)" }} />
            </summary>
            <p style={{ padding: "0 18px 18px", margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
