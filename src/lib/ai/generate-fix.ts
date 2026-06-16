import Anthropic from "@anthropic-ai/sdk";
import type { AccessibilityIssue } from "@/lib/types/issue";
import type { PageMeta } from "@/lib/types/scan-result";

/* ── Types ── */

export interface AiFix {
  fixedHtml: string;
  explanation: string;
}

export type GenerateFixResult =
  | { ok: true; fix: AiFix; tokenUsage: { input: number; output: number } }
  | { ok: false; error: string; code: "NO_API_KEY" | "RATE_LIMITED" | "PARSE_ERROR" | "API_ERROR" };

/* ── System prompt (cached across calls via Anthropic prompt caching) ── */

const SYSTEM_PROMPT = `You are an expert web accessibility remediation engine. You analyze HTML elements that have failed WCAG accessibility checks and produce corrected HTML code.

RULES:
1. Return ONLY a JSON object. No markdown, no preamble, no commentary.
2. Make the MINIMUM change needed to fix the accessibility violation. Preserve all existing attributes, classes, styles, and structure.
3. Never remove content or functionality — only add or modify what is necessary.
4. For images without alt text: write descriptive alt text based on context clues (filename, CSS classes, surrounding text, page title). If clearly decorative, use alt="".
5. For color-contrast issues: suggest a corrected foreground or background color meeting WCAG AA ratio (4.5:1 normal text, 3:1 large text). Apply as an inline style addition, preserving existing styles.
6. For missing landmarks: provide a code snippet to INSERT with a comment showing where to place it (e.g. "<!-- Insert as first child of <body> -->").
7. For heading hierarchy issues: change the heading level to the correct one while preserving all content and attributes.
8. For page-level structural issues (skip-link-missing, landmark-main-missing, no-headings): provide a snippet to INSERT, not a replacement.
9. For ARIA issues: add, remove, or correct the specific ARIA attributes needed.
10. For form labels: add an associated <label> element or aria-label attribute.
11. Do NOT suggest JavaScript-only fixes.
12. If the element HTML is truncated (ends abruptly), close tags reasonably.

RESPONSE FORMAT — return exactly this JSON shape:
{"fixedHtml": "<the corrected HTML>", "explanation": "<1-2 sentence explanation of what was changed and why>"}`;

/* ── Client singleton ── */

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  client = new Anthropic({ apiKey });
  return client;
}

export function isAiAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/* ── Prompt builder ── */

function buildUserMessage(issue: AccessibilityIssue, pageMeta: PageMeta): string {
  const wcag = issue.wcagCriterion
    ? `${issue.wcagCriterion.number} ${issue.wcagCriterion.name} (Level ${issue.wcagCriterion.level})`
    : "None";

  const isPageLevel = !issue.element.html || issue.element.html === "<body>";

  let msg = `Fix the following accessibility violation.

RULE: ${issue.ruleId}
SEVERITY: ${issue.severity}
DESCRIPTION: ${issue.description}
GUIDANCE: ${issue.fixSuggestion}
WCAG: ${wcag}
IMPACT: ${issue.impact.join(", ")}

ELEMENT HTML:
${issue.element.html}

SELECTOR: ${issue.element.selector}

PAGE CONTEXT:
- URL: ${pageMeta.url}
- Title: ${pageMeta.title}
- Language: ${pageMeta.lang}
- Images: ${pageMeta.imageCount} (${pageMeta.imagesWithoutAlt} missing alt)
- Headings: ${pageMeta.headingCount}`;

  if (isPageLevel) {
    msg += `\n\nThis is a page-level structural issue. Provide a code SNIPPET to INSERT (not a replacement), and explain where to place it.`;
  }

  return msg;
}

/* ── Response parser ── */

function parseFixResponse(text: string): AiFix | null {
  // Try direct parse
  try {
    const parsed = JSON.parse(text);
    if (parsed.fixedHtml && parsed.explanation) return parsed;
  } catch { /* try extraction */ }

  // Extract JSON from potential markdown wrapping
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (parsed.fixedHtml && parsed.explanation) return parsed;
    } catch { /* give up */ }
  }

  return null;
}

/* ── Main function ── */

export async function generateFix(
  issue: AccessibilityIssue,
  pageMeta: PageMeta
): Promise<GenerateFixResult> {
  const anthropic = getClient();
  if (!anthropic) {
    return { ok: false, error: "ANTHROPIC_API_KEY not configured", code: "NO_API_KEY" };
  }

  const userMessage = buildUserMessage(issue, pageMeta);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    const parsed = parseFixResponse(text);
    if (!parsed) {
      return { ok: false, error: "Failed to parse AI response", code: "PARSE_ERROR" };
    }

    return {
      ok: true,
      fix: parsed,
      tokenUsage: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    };
  } catch (err: unknown) {
    if (err instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "Rate limit exceeded — try again in a moment", code: "RATE_LIMITED" };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Claude API error",
      code: "API_ERROR",
    };
  }
}
