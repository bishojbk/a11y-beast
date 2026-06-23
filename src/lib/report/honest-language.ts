// Guard against the claims the FTC fined accessiBe $1M for. Run findBannedClaims
// over GENERATED documents (evidence file, statement) — not marketing prose,
// which legitimately negates these phrases ("not a guarantee of compliance").
// "Fully conformant" is deliberately NOT banned: it's a real WCAG level a
// manually-audited site can claim — we warn on it in the UI instead.

interface BannedClaim {
  pattern: RegExp;
  why: string;
}

export const BANNED_CLAIMS: BannedClaim[] = [
  { pattern: /\bguarantees?\s+(of\s+)?(wcag\s+|ada\s+)?compliance\b/i, why: "implies certainty we cannot provide" },
  { pattern: /\b(fully|100%)\s+compliant\b/i, why: "automated testing cannot establish full compliance" },
  { pattern: /\bcertif(ied|ies|y)\s+(as\s+)?(compliant|accessible|conformant)\b/i, why: "we do not certify" },
  { pattern: /\bensures?\s+(wcag\s+|ada\s+)?compliance\b/i, why: "overclaim" },
  { pattern: /\bmakes?\s+(your\s+|the\s+)?(site|website|page)\s+(wcag\s+|ada\s+)?compliant\b/i, why: "the overlay claim the FTC fined" },
  { pattern: /\bautomatically\s+(wcag\s+|ada\s+)?compliant\b/i, why: "overclaim" },
];

export function findBannedClaims(text: string): { match: string; why: string }[] {
  const out: { match: string; why: string }[] = [];
  for (const { pattern, why } of BANNED_CLAIMS) {
    const m = text.match(pattern);
    if (m) out.push({ match: m[0], why });
  }
  return out;
}

/**
 * Dev-only: warn if generated copy contains a banned claim. No-op in
 * production. Keeps future edits to the document templates honest.
 */
export function assertHonest(label: string, text: string): void {
  if (process.env.NODE_ENV === "production") return;
  const hits = findBannedClaims(text);
  if (hits.length) {
    console.warn(`[honest-language] ${label} contains banned claim(s):`, hits);
  }
}
