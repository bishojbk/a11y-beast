import { Plus } from "lucide-react";
import { PRICING_FAQ as FAQ } from "@/lib/seo/faq";

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
