import type { EvidenceRecord } from "./evidence-file";

// The ledger = an append-only history of evidence records per site. Re-scanning
// over time + diffing the latest two is the "regression proof" a free scanner
// can't produce. v0 is localStorage-backed (zero infra, demoable on one
// machine); the production path is the server share store. See
// docs/evidence-ledger-spec.md.

const LEDGER_KEY = "a11y-beast:evidence-ledger";
const MAX_PER_SITE = 24;

export interface EvidenceDiff {
  /** Scan date of the previous record we compared against. */
  sinceDate: string;
  /** WCAG criteria that had issues before and now have none. */
  resolvedCriteria: string[];
  /** WCAG criteria with issues now that had none before. */
  newCriteria: string[];
  prevTotalIssues: number;
  currTotalIssues: number;
  /** curr − prev. Negative = improvement. */
  netIssueDelta: number;
}

function siteKey(url: string): string {
  try { return new URL(url).host; } catch { return url; }
}

type LedgerStore = Record<string, EvidenceRecord[]>;

function load(): LedgerStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEDGER_KEY);
    return raw ? (JSON.parse(raw) as LedgerStore) : {};
  } catch { return {}; }
}

function save(store: LedgerStore): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LEDGER_KEY, JSON.stringify(store)); } catch { /* quota/unavailable */ }
}

/** Entries for a site, newest first. */
export function getSiteEntries(url: string): EvidenceRecord[] {
  const list = load()[siteKey(url)] ?? [];
  return [...list].sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

/**
 * Append a record to its site's ledger. Skips a no-op (identical contentHash to
 * the most recent entry) so re-opening an unchanged scan doesn't pad the trail.
 * Returns true if it was actually appended.
 */
export function appendEntry(record: EvidenceRecord): boolean {
  const store = load();
  const key = siteKey(record.siteUrl);
  const list = store[key] ?? [];
  const newest = [...list].sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
  if (newest && newest.contentHash === record.contentHash) return false;
  store[key] = [...list, record].slice(-MAX_PER_SITE);
  save(store);
  return true;
}

function affectedCriteria(r: EvidenceRecord): Set<string> {
  return new Set(r.clauses.filter((c) => c.criterion !== "—").map((c) => c.criterion));
}

/** Diff a previous record against the current one. */
export function diffEntries(prev: EvidenceRecord, curr: EvidenceRecord): EvidenceDiff {
  const prevSet = affectedCriteria(prev);
  const currSet = affectedCriteria(curr);
  return {
    sinceDate: prev.scanDate,
    resolvedCriteria: [...prevSet].filter((c) => !currSet.has(c)).sort(),
    newCriteria: [...currSet].filter((c) => !prevSet.has(c)).sort(),
    prevTotalIssues: prev.summary.totalIssues,
    currTotalIssues: curr.summary.totalIssues,
    netIssueDelta: curr.summary.totalIssues - prev.summary.totalIssues,
  };
}
