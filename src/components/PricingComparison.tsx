import { Check } from "lucide-react";

const TIERS = ["Free", "Pro", "Agency", "Enterprise"] as const;

/** Cell value: true = included, false = not included, string = qualifier text. */
type Cell = boolean | string;

interface Group {
  title: string;
  rows: [string, Cell, Cell, Cell, Cell][];
}

const GROUPS: Group[] = [
  {
    title: "Scanning",
    rows: [
      ["Single-page scans", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
      ["Multi-page site crawls", false, true, "Deeper", "Custom"],
      ["Sites (multi-page)", false, "3", "10", "Unlimited"],
      ["125+ checks · real-browser rendering", true, true, true, true],
      ["All 16 legal frameworks mapped", true, true, true, true],
      ["Per-success-criterion conformance", true, true, true, true],
    ],
  },
  {
    title: "Reporting",
    rows: [
      ["Markdown & JSON export", true, true, true, true],
      ["Per-jurisdiction legal report", false, true, true, true],
      ["AI fix suggestions", false, true, true, true],
      ["Scan history & compare", false, true, true, true],
    ],
  },
  {
    title: "Scale & integrations",
    rows: [
      ["CLI + GitHub Action", true, true, true, true],
      ["Bulk multi-client scanning", false, false, true, true],
      ["SSO & team management", false, false, false, true],
      ["Custom frameworks & jurisdictions", false, false, false, true],
      ["Expert manual review + VPAT", false, false, false, true],
    ],
  },
  {
    title: "Support",
    rows: [["Support", "Community", "Priority email", "Priority", "Dedicated + SLA"]],
  },
];

function CellContent({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span role="img" aria-label="Included" style={{ display: "inline-flex", color: "var(--pass)" }}>
        <Check size={16} aria-hidden="true" />
      </span>
    );
  }
  if (value === false) {
    return <span aria-label="Not included" style={{ color: "var(--text-tertiary)", opacity: 0.5 }}>—</span>;
  }
  return <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{value}</span>;
}

export default function PricingComparison() {
  const th: React.CSSProperties = { padding: "12px 14px", textAlign: "center", fontSize: 12, fontWeight: 600 };
  const rowTh: React.CSSProperties = { padding: "11px 14px", textAlign: "left", fontWeight: 400, fontSize: 13.5, color: "var(--text-secondary)" };
  const td: React.CSSProperties = { padding: "11px 14px", textAlign: "center", verticalAlign: "middle", borderTop: "1px solid var(--border-faint)" };

  return (
    <section aria-labelledby="compare-heading" style={{ marginTop: 72 }}>
      <h2 id="compare-heading" className="font-display" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", textAlign: "center", marginBottom: 28 }}>
        Compare every plan
      </h2>
      <div style={{ overflowX: "auto", border: "1px solid var(--border-default)", borderRadius: 6 }}>
        <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
          <caption className="sr-only">Feature comparison across Free, Pro, Agency, and Enterprise plans</caption>
          <thead>
            <tr style={{ background: "var(--bg-raised)" }}>
              <th scope="col" style={{ ...th, textAlign: "left" }} className="mono">
                <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Features</span>
              </th>
              {TIERS.map((name) => (
                <th key={name} scope="col" style={th} className="font-display">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <GroupRows key={g.title} group={g} rowTh={rowTh} td={td} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function GroupRows({ group, rowTh, td }: { group: Group; rowTh: React.CSSProperties; td: React.CSSProperties }) {
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={5}
          className="mono"
          style={{ textAlign: "left", padding: "16px 14px 8px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent-text)", fontWeight: 600 }}
        >
          {group.title}
        </th>
      </tr>
      {group.rows.map(([label, ...cells]) => (
        <tr key={label}>
          <th scope="row" style={rowTh}>{label}</th>
          {cells.map((c, i) => (
            <td key={i} style={td}>
              <CellContent value={c} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
