import type { Severity } from "@/lib/types/issue";

const KEY = "a11y-beast-history";
const MAX_ENTRIES = 12;

/**
 * A trimmed scan record kept in localStorage — summary metrics only, no full
 * issue list, so we stay well under the storage quota even for site crawls.
 */
export interface ScanHistoryEntry {
  id: string;
  url: string;
  timestamp: string;
  isSite: boolean;
  pagesScanned?: number;
  overall: number;
  grade: string;
  issueCount: number;
  bySeverity: Record<Severity, number>;
  frameworks: Array<{ id: string; shortName: string; percentage: number }>;
}

export function loadHistory(): ScanHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ScanHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(entry: ScanHistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or serialization failure — history is best-effort */
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
