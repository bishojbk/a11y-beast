"use client";

import { useMemo, useState } from "react";

// Fields modeled on the W3C/WAI Accessibility Statement Generator structure
// (w3.org/WAI/planning/statements/). Honest by design: default status is
// "Partially conformant" — we don't let users one-click claim full conformance.

type Status = "Partially conformant" | "Fully conformant" | "Non-conformant" | "Not assessed";

const STATUS_SENTENCE: Record<Status, string> = {
  "Fully conformant": "Fully conformant means the content fully conforms to the accessibility standard without any exceptions.",
  "Partially conformant": "Partially conformant means that some parts of the content do not fully conform to the accessibility standard.",
  "Non-conformant": "Non-conformant means the content does not conform to the accessibility standard.",
  "Not assessed": "The conformance of this site has not yet been formally assessed.",
};

const MEASURE_OPTIONS = [
  "Include accessibility as part of our mission statement",
  "Include accessibility throughout our internal policies",
  "Assign clear accessibility goals and responsibilities",
  "Provide accessibility training for our staff",
  "Employ formal accessibility quality-assurance methods",
];

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-primary)" };
const inputStyle: React.CSSProperties = {
  background: "var(--bg-wash, transparent)", border: "1px solid var(--border-default)", borderRadius: 6,
  padding: "9px 11px", fontSize: 14, color: "var(--text-primary)", fontFamily: "inherit",
};

function todayISO() {
  // Runs client-side in the browser, so a real Date is fine here.
  return new Date().toISOString().slice(0, 10);
}

export default function StatementGenerator() {
  const [org, setOrg] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [standard, setStandard] = useState("WCAG 2.1");
  const [level, setLevel] = useState("AA");
  const [status, setStatus] = useState<Status>("Partially conformant");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [measures, setMeasures] = useState<string[]>([MEASURE_OPTIONS[0]]);
  const [limitations, setLimitations] = useState("");
  const [assessment, setAssessment] = useState("Self-evaluation");
  const [date, setDate] = useState(todayISO());
  const [copied, setCopied] = useState(false);

  const toggleMeasure = (m: string) =>
    setMeasures((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const statement = useMemo(() => {
    const name = siteName.trim() || "[your website]";
    const orgName = org.trim() || "[your organization]";
    const std = `${standard} level ${level}`;
    const lines: string[] = [];
    lines.push(`Accessibility Statement for ${name}`);
    lines.push("");
    lines.push(`${orgName} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.`);
    lines.push("");
    lines.push("Measures to support accessibility");
    if (measures.length) {
      lines.push(`${orgName} takes the following measures to ensure accessibility:`);
      measures.forEach((m) => lines.push(`  • ${m}`));
    } else {
      lines.push(`${orgName} takes measures to ensure accessibility of ${name}.`);
    }
    lines.push("");
    lines.push("Conformance status");
    lines.push(`The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. ${name} is ${status.toLowerCase()} with ${std}. ${STATUS_SENTENCE[status]}`);
    lines.push("");
    if (limitations.trim()) {
      lines.push("Known limitations");
      lines.push(`Despite our best efforts, some content may not yet be fully accessible. Known limitations:`);
      limitations.split("\n").map((l) => l.trim()).filter(Boolean).forEach((l) => lines.push(`  • ${l}`));
      lines.push("");
    }
    lines.push("Feedback");
    lines.push(`We welcome your feedback on the accessibility of ${name}. Please let us know if you encounter accessibility barriers:`);
    if (email.trim()) lines.push(`  • E-mail: ${email.trim()}`);
    if (phone.trim()) lines.push(`  • Phone: ${phone.trim()}`);
    if (!email.trim() && !phone.trim()) lines.push(`  • [add a contact email or phone number]`);
    lines.push("");
    lines.push("Assessment approach");
    lines.push(`${orgName} assessed the accessibility of ${name} by the following approach: ${assessment}.`);
    lines.push("");
    lines.push(`This statement was created on ${date}.`);
    return lines.join("\n");
  }, [org, siteName, siteUrl, standard, level, status, email, phone, measures, limitations, assessment, date]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 32, alignItems: "start" }} className="stmt-grid">
      {/* ── Form ── */}
      <form aria-label="Accessibility statement details" onSubmit={(e) => e.preventDefault()}>
        <div style={field}>
          <label htmlFor="sg-org" style={labelStyle}>Organization name</label>
          <input id="sg-org" style={inputStyle} value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Acme Inc." />
        </div>
        <div style={field}>
          <label htmlFor="sg-site" style={labelStyle}>Website name</label>
          <input id="sg-site" style={inputStyle} value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Acme Store" />
        </div>
        <div style={field}>
          <label htmlFor="sg-url" style={labelStyle}>Website URL</label>
          <input id="sg-url" style={inputStyle} value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://example.com" />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ ...field, flex: 1 }}>
            <label htmlFor="sg-std" style={labelStyle}>Standard</label>
            <select id="sg-std" style={inputStyle} value={standard} onChange={(e) => setStandard(e.target.value)}>
              <option>WCAG 2.2</option>
              <option>WCAG 2.1</option>
              <option>WCAG 2.0</option>
            </select>
          </div>
          <div style={{ ...field, width: 110 }}>
            <label htmlFor="sg-level" style={labelStyle}>Level</label>
            <select id="sg-level" style={inputStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>A</option>
              <option>AA</option>
              <option>AAA</option>
            </select>
          </div>
        </div>
        <div style={field}>
          <label htmlFor="sg-status" style={labelStyle}>Conformance status</label>
          <select id="sg-status" style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option>Partially conformant</option>
            <option>Fully conformant</option>
            <option>Non-conformant</option>
            <option>Not assessed</option>
          </select>
          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{STATUS_SENTENCE[status]}</span>
        </div>
        <fieldset style={{ ...field, border: "none", padding: 0, margin: "0 0 16px" }}>
          <legend style={{ ...labelStyle, marginBottom: 6 }}>Measures you take</legend>
          {MEASURE_OPTIONS.map((m) => (
            <label key={m} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={measures.includes(m)} onChange={() => toggleMeasure(m)} style={{ marginTop: 3 }} />
              <span>{m}</span>
            </label>
          ))}
        </fieldset>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ ...field, flex: 1 }}>
            <label htmlFor="sg-email" style={labelStyle}>Feedback e-mail</label>
            <input id="sg-email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="access@example.com" />
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label htmlFor="sg-phone" style={labelStyle}>Feedback phone (optional)</label>
            <input id="sg-phone" style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 …" />
          </div>
        </div>
        <div style={field}>
          <label htmlFor="sg-lim" style={labelStyle}>Known limitations (one per line, optional)</label>
          <textarea id="sg-lim" rows={3} style={{ ...inputStyle, resize: "vertical" }} value={limitations} onChange={(e) => setLimitations(e.target.value)} placeholder={"Comments: may not have captions on older videos\nThird-party maps: not fully keyboard accessible"} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ ...field, flex: 1 }}>
            <label htmlFor="sg-assess" style={labelStyle}>Assessment approach</label>
            <select id="sg-assess" style={inputStyle} value={assessment} onChange={(e) => setAssessment(e.target.value)}>
              <option>Self-evaluation</option>
              <option>External evaluation</option>
            </select>
          </div>
          <div style={{ ...field, flex: 1 }}>
            <label htmlFor="sg-date" style={labelStyle}>Date</label>
            <input id="sg-date" type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
      </form>

      {/* ── Output ── */}
      <div style={{ position: "sticky", top: 88 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={labelStyle}>Your statement</span>
          <button type="button" onClick={copy} className="scan-btn" style={{ height: 34, padding: "0 16px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <pre aria-live="polite" style={{
          whiteSpace: "pre-wrap", wordBreak: "break-word", background: "var(--bg-wash, rgba(127,127,127,0.06))",
          border: "1px solid var(--border-faint)", borderRadius: 8, padding: "18px 20px", fontSize: 13,
          lineHeight: 1.6, color: "var(--text-secondary)", fontFamily: "var(--font-mono, monospace)", margin: 0,
          maxHeight: 560, overflow: "auto",
        }}>{statement}</pre>
        <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 12, lineHeight: 1.55 }}>
          A starting template based on the{" "}
          <a href="https://www.w3.org/WAI/planning/statements/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-text)" }}>W3C/WAI</a>{" "}
          structure. Only claim the conformance level you can actually back up — overstating it carries
          legal risk. EU/UK public-sector statements also require a formal complaints/enforcement link.
        </p>
      </div>
    </div>
  );
}
