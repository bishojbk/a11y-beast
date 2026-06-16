const FLAG_STYLES: Record<string, { bg: string; fg: string }> = {
  US: { bg: "#1a2547", fg: "#E8EAF2" },
  CA: { bg: "#3a1f20", fg: "#E8D4D4" },
  EU: { bg: "#1a2b4a", fg: "#F0D96A" },
  UK: { bg: "#1e2747", fg: "#E8EAF2" },
  AU: { bg: "#1a2747", fg: "#E8EAF2" },
  JP: { bg: "#2c1417", fg: "#E8D4D4" },
  IN: { bg: "#33260f", fg: "#F0C87A" },
  KR: { bg: "#1b2a3f", fg: "#E8EAF2" },
  NZ: { bg: "#1a2747", fg: "#E8EAF2" },
  IL: { bg: "#1a2a3f", fg: "#E8EAF2" },
};

export default function Flag({ code }: { code: string }) {
  const c = FLAG_STYLES[code] ?? { bg: "var(--bg-overlay)", fg: "var(--text-secondary)" };
  return (
    <span className="flag-mono" style={{ background: c.bg, color: c.fg }} aria-hidden="true">
      {code}
    </span>
  );
}

export function flagForRegion(region: string): string {
  const r = region.toLowerCase();
  if (r.includes("california")) return "CA";
  if (r.includes("usa") || r.includes("federal")) return "US";
  if (r.includes("ontario") || r.includes("canada")) return "CA";
  if (r.includes("eu")) return "EU";
  if (r.includes("united kingdom") || r.includes("uk")) return "UK";
  if (r.includes("australia")) return "AU";
  if (r.includes("japan")) return "JP";
  if (r.includes("india")) return "IN";
  if (r.includes("korea")) return "KR";
  if (r.includes("new zealand")) return "NZ";
  if (r.includes("israel")) return "IL";
  return "—";
}
