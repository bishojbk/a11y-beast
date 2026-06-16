import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "A11y Beast — you're not just failing WCAG. You're breaking 16 laws.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card. Self-contained (system serif fallback) so it never fails
// to render on a missing-font fetch. Every multi-child box sets display:flex —
// Satori requires it.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0C0E",
          padding: "72px 80px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 30, height: 30, borderRadius: 7, background: "#D6354A" }} />
          <div style={{ display: "flex", fontFamily: "monospace", fontSize: 22, letterSpacing: 4, color: "#F4F5F6" }}>
            A11Y BEAST
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 12, fontSize: 38, color: "#AAB0B8", marginBottom: 10 }}>
            <span>Most tools say you fail</span>
            <span style={{ fontFamily: "monospace", fontSize: 30, color: "#7C828C" }}>WCAG 1.1.1.</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 18, fontSize: 74, fontWeight: 700, color: "#F4F5F6", lineHeight: 1.05 }}>
            <span>We say</span>
            <span style={{ color: "#FF6B7A", fontStyle: "italic" }}>you&rsquo;re breaking 16 laws.</span>
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontFamily: "monospace", fontSize: 21, color: "#7C828C", gap: 20 }}>
          <span>125+ checks</span>
          <span>·</span>
          <span>16 legal frameworks</span>
          <span>·</span>
          <span>real browser, not an overlay</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
