import type { ComplianceFramework } from "@/lib/types/compliance";

// Each framework defines which WCAG tag groups it covers.
// This determines which axe-core rules "apply" to it.
type WcagTagSet = string[];

export interface FrameworkWithTags extends ComplianceFramework {
  /** axe-core tags this framework's WCAG basis covers */
  acceptedTags: WcagTagSet;
  /** Extra score deductions specific to this framework */
  bonusPenalties: {
    missingA11yStatement?: number;   // % deducted if no accessibility statement link
    missingSkipLink?: number;        // % deducted if no skip nav
    missingLang?: number;            // % deducted if no lang attribute
    severityMultiplier?: number;     // multiplier for severity penalty (default 1)
    elementCountWeight?: number;     // multiplier for element-count penalty (default 0)
  };
}

const WCAG_20: WcagTagSet = ["wcag2a", "wcag2aa", "wcag111", "wcag131", "wcag143", "wcag211", "wcag244", "wcag311", "wcag412", "best-practice"];
const WCAG_21: WcagTagSet = [...WCAG_20, "wcag21a", "wcag21aa"];
const WCAG_22: WcagTagSet = [...WCAG_21, "wcag22aa"];

export const FRAMEWORKS: FrameworkWithTags[] = [
  // USA
  {
    id: "ada-title-ii",
    name: "ADA Title II",
    shortName: "ADA II",
    region: "USA (Public Sector)",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "public",
    enforcementDate: "2026-04-24",
    penalties: "DOJ enforcement, injunctive relief. Entities ≥50K pop: Apr 2026 deadline. <50K pop: Apr 2027.",
    url: "https://www.ada.gov/law-and-regs/title-ii-2024/",
    deadlineAlert: "Entities ≥50K pop: Apr 24 2026 deadline. <50K pop: Apr 26 2027.",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 3, missingSkipLink: 3, severityMultiplier: 1.3 },
  },
  {
    id: "ada-title-iii",
    name: "ADA Title III",
    shortName: "ADA III",
    region: "USA",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "5,114 lawsuits in 2025. Settlements $5K-$75K.",
    url: "https://www.ada.gov/topics/title-iii/",
    acceptedTags: WCAG_21,
    bonusPenalties: { severityMultiplier: 1.5, missingSkipLink: 2 }, // Highest litigation — severity matters most
  },
  {
    id: "section-508",
    name: "Section 508 (Revised)",
    shortName: "Sec 508",
    region: "USA Federal",
    wcagBasis: "WCAG 2.0 AA",
    appliesTo: "public",
    penalties: "Federal procurement disqualification, agency complaints, corrective action orders",
    url: "https://www.section508.gov/",
    acceptedTags: WCAG_20, // Only WCAG 2.0 — fewer rules apply
    bonusPenalties: { missingSkipLink: 5, missingLang: 4, severityMultiplier: 1.0 },
  },
  {
    id: "california-unruh",
    name: "California Unruh Civil Rights Act",
    shortName: "Unruh Act",
    region: "California, USA",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "$4,000 minimum per violation per visit",
    url: "https://oag.ca.gov/system/files/initiatives/pdfs/title-summary-16-0059.pdf",
    acceptedTags: WCAG_21,
    bonusPenalties: { elementCountWeight: 0.15, severityMultiplier: 1.2 }, // Per-violation = element count matters
  },
  // Europe
  {
    id: "eaa",
    name: "European Accessibility Act",
    shortName: "EAA",
    region: "EU (27 states)",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    enforcementDate: "2025-06-28",
    penalties: "Member-state dependent. Up to 4% revenue. Enforced since June 28, 2025.",
    url: "https://ec.europa.eu/social/main.jsp?catId=1202",
    deadlineAlert: "EAA is now in effect since June 28, 2025. Non-compliance may result in penalties.",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 8, severityMultiplier: 1.1 }, // A11y statement is LEGALLY REQUIRED
  },
  {
    id: "en-301-549",
    name: "EN 301 549 v3.2.1",
    shortName: "EN 301 549",
    region: "EU",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "Harmonised standard for EAA/WAD compliance",
    url: "https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf",
    acceptedTags: [...WCAG_21, "EN-301-549"], // Has extra EN-specific rules
    bonusPenalties: { missingA11yStatement: 6, missingLang: 3, severityMultiplier: 1.0 },
  },
  {
    id: "eu-wad",
    name: "EU Web Accessibility Directive",
    shortName: "EU WAD",
    region: "EU (Public Sector)",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "public",
    penalties: "Monitoring body enforcement, compliance reports",
    url: "https://digital-strategy.ec.europa.eu/en/policies/web-accessibility",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 7, missingSkipLink: 2, severityMultiplier: 0.9 },
  },
  // UK
  {
    id: "equality-act-2010",
    name: "Equality Act 2010",
    shortName: "Equality Act",
    region: "UK",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "Compensation awards + EHRC compliance orders",
    url: "https://www.legislation.gov.uk/ukpga/2010/15/contents",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 6, severityMultiplier: 1.1 }, // UK requires a11y statement
  },
  // Canada
  {
    id: "aoda",
    name: "Accessibility for Ontarians with Disabilities Act",
    shortName: "AODA",
    region: "Ontario, Canada",
    wcagBasis: "WCAG 2.0 AA",
    appliesTo: "both",
    penalties: "Up to CAD 100,000/day for corporations",
    url: "https://www.ontario.ca/laws/statute/05a11",
    acceptedTags: WCAG_20, // Still on WCAG 2.0
    bonusPenalties: { missingA11yStatement: 4, missingLang: 5, severityMultiplier: 1.0 }, // Bilingual Canada — lang matters
  },
  {
    id: "aca",
    name: "Accessible Canada Act",
    shortName: "ACA",
    region: "Canada Federal",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "Up to CAD 250,000 per violation",
    url: "https://laws-lois.justice.gc.ca/eng/acts/A-0.6/",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingLang: 5, missingA11yStatement: 3, severityMultiplier: 1.1 },
  },
  // Asia-Pacific
  {
    id: "dda-1992",
    name: "Disability Discrimination Act 1992",
    shortName: "DDA",
    region: "Australia",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "Court orders, AHRC compensation",
    url: "https://www.legislation.gov.au/Details/C2018C00125",
    acceptedTags: WCAG_21,
    bonusPenalties: { severityMultiplier: 0.9 },
  },
  {
    id: "jis-x-8341",
    name: "JIS X 8341-3:2016",
    shortName: "JIS",
    region: "Japan",
    wcagBasis: "WCAG 2.0 aligned",
    appliesTo: "both",
    penalties: "Reasonable accommodation since 2024",
    url: "https://www.jisc.go.jp/",
    acceptedTags: WCAG_20,
    bonusPenalties: { severityMultiplier: 0.8 },
  },
  {
    id: "rpd-act-2016",
    name: "Rights of Persons with Disabilities Act 2016",
    shortName: "RPD Act",
    region: "India",
    wcagBasis: "WCAG 2.0 AA",
    appliesTo: "public",
    penalties: "Government website compliance mandates",
    url: "https://legislative.gov.in/sites/default/files/A2016-49_1.pdf",
    acceptedTags: WCAG_20,
    bonusPenalties: { severityMultiplier: 0.7 },
  },
  {
    id: "korean-ada",
    name: "Korean Disability Discrimination Act",
    shortName: "KDDA",
    region: "South Korea",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "All organizations since 2013",
    url: "https://elaw.klri.re.kr/",
    acceptedTags: WCAG_21,
    bonusPenalties: { severityMultiplier: 1.0 },
  },
  {
    id: "nz-web-standards",
    name: "NZ Web Accessibility Standard 1.1",
    shortName: "NZ WAS",
    region: "New Zealand",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "public",
    penalties: "Government mandate",
    url: "https://www.digital.govt.nz/standards-and-guidance/nz-government-web-standards/web-accessibility-standard-1-1/",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 3, severityMultiplier: 0.9 },
  },
  {
    id: "israel-eq-rights",
    name: "Equal Rights for Persons with Disabilities",
    shortName: "Israel SI 5568",
    region: "Israel",
    wcagBasis: "WCAG 2.1 AA",
    appliesTo: "both",
    penalties: "ILS 75,000 first offense, ILS 150,000 subsequent",
    url: "https://www.gov.il/en/departments/legalInfo/equal_rights_for_persons_with_disabilities_law",
    acceptedTags: WCAG_21,
    bonusPenalties: { missingA11yStatement: 5, missingLang: 3, severityMultiplier: 1.2 }, // Israel SI 5568 has extra requirements
  },
];

export function getFrameworkById(id: string): FrameworkWithTags | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}
