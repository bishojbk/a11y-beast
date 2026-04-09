import type { WcagPrinciple, WcagLevel } from "@/lib/types/issue";

/**
 * WCAG 2.2 success criterion names.
 * Used to provide human-readable names in scan reports.
 */
const WCAG_CRITERION_NAMES: Record<string, string> = {
  // 1. Perceivable
  "1.1.1": "Non-text Content",
  "1.2.1": "Audio-only and Video-only (Prerecorded)",
  "1.2.2": "Captions (Prerecorded)",
  "1.2.3": "Audio Description or Media Alternative",
  "1.2.4": "Captions (Live)",
  "1.2.5": "Audio Description (Prerecorded)",
  "1.3.1": "Info and Relationships",
  "1.3.2": "Meaningful Sequence",
  "1.3.3": "Sensory Characteristics",
  "1.3.4": "Orientation",
  "1.3.5": "Identify Input Purpose",
  "1.3.6": "Identify Purpose",
  "1.4.1": "Use of Color",
  "1.4.2": "Audio Control",
  "1.4.3": "Contrast (Minimum)",
  "1.4.4": "Resize Text",
  "1.4.5": "Images of Text",
  "1.4.6": "Contrast (Enhanced)",
  "1.4.7": "Low or No Background Audio",
  "1.4.8": "Visual Presentation",
  "1.4.9": "Images of Text (No Exception)",
  "1.4.10": "Reflow",
  "1.4.11": "Non-text Contrast",
  "1.4.12": "Text Spacing",
  "1.4.13": "Content on Hover or Focus",
  // 2. Operable
  "2.1.1": "Keyboard",
  "2.1.2": "No Keyboard Trap",
  "2.1.3": "Keyboard (No Exception)",
  "2.1.4": "Character Key Shortcuts",
  "2.2.1": "Timing Adjustable",
  "2.2.2": "Pause, Stop, Hide",
  "2.3.1": "Three Flashes or Below Threshold",
  "2.4.1": "Bypass Blocks",
  "2.4.2": "Page Titled",
  "2.4.3": "Focus Order",
  "2.4.4": "Link Purpose (In Context)",
  "2.4.5": "Multiple Ways",
  "2.4.6": "Headings and Labels",
  "2.4.7": "Focus Visible",
  "2.4.11": "Focus Not Obscured (Minimum)",
  "2.4.12": "Focus Not Obscured (Enhanced)",
  "2.4.13": "Focus Appearance",
  "2.5.1": "Pointer Gestures",
  "2.5.2": "Pointer Cancellation",
  "2.5.3": "Label in Name",
  "2.5.4": "Motion Actuation",
  "2.5.7": "Dragging Movements",
  "2.5.8": "Target Size (Minimum)",
  // 3. Understandable
  "3.1.1": "Language of Page",
  "3.1.2": "Language of Parts",
  "3.2.1": "On Focus",
  "3.2.2": "On Input",
  "3.2.6": "Consistent Help",
  "3.3.1": "Error Identification",
  "3.3.2": "Labels or Instructions",
  "3.3.3": "Error Suggestion",
  "3.3.4": "Error Prevention (Legal, Financial, Data)",
  "3.3.7": "Redundant Entry",
  "3.3.8": "Accessible Authentication (Minimum)",
  "3.3.9": "Accessible Authentication (Enhanced)",
  // 4. Robust
  "4.1.1": "Parsing",
  "4.1.2": "Name, Role, Value",
  "4.1.3": "Status Messages",
};

export function getWcagCriterionName(number: string): string {
  return WCAG_CRITERION_NAMES[number] ?? "";
}

export function extractWcagCriterion(tags: string[]) {
  for (const tag of tags) {
    const match = tag.match(/^wcag(\d)(\d)(\d+)$/);
    if (match) {
      const number = `${match[1]}.${match[2]}.${match[3]}`;
      const principle: WcagPrinciple =
        match[1] === "1" ? "perceivable" :
        match[1] === "2" ? "operable" :
        match[1] === "3" ? "understandable" : "robust";
      let level: WcagLevel = "AA";
      if (tags.includes("wcag2a") || tags.includes("wcag21a")) level = "A";
      if (tags.includes("wcag2aaa") || tags.includes("wcag21aaa")) level = "AAA";
      return { number, name: getWcagCriterionName(number), level, principle };
    }
  }
  return null;
}
