import type { ScanResult } from "@/lib/types/scan-result";

/**
 * Baked sample scan — a real scan of the W3C's own "Before" accessibility demo
 * (the CityLights "Before and After Demonstration"), trimmed to <=3 occurrences
 * per rule. The URL is genuine and public, so visitors can re-scan it themselves
 * and verify these numbers. Powers the "See a sample report" CTA so first-time
 * visitors see the payoff before committing to a scan.
 */
export const SAMPLE_RESULT: ScanResult = {
  "id": "sample-report",
  "url": "https://www.w3.org/WAI/demos/bad/before/home.html",
  "inputMethod": "url",
  "timestamp": "2026-06-15T12:00:00.000Z",
  "scanDurationMs": 2715,
  "pageMeta": {
    "url": "https://www.w3.org/WAI/demos/bad/before/home.html",
    "title": "Welcome to CityLights! [Inaccessible Home Page]",
    "lang": "(not set)",
    "hasH1": true,
    "hasSkipLink": true,
    "hasAccessibilityStatement": false,
    "imageCount": 42,
    "imagesWithoutAlt": 36,
    "linkCount": 55,
    "headingCount": 1,
    "formCount": 0
  },
  "score": {
    "overall": 54,
    "grade": "D",
    "byLevel": {
      "A": {
        "passed": 11,
        "failed": 50,
        "total": 61
      },
      "AA": {
        "passed": 11,
        "failed": 36,
        "total": 47
      },
      "AAA": {
        "passed": 0,
        "failed": 0,
        "total": 0
      }
    },
    "byPrinciple": {
      "perceivable": {
        "passed": 8,
        "failed": 46
      },
      "operable": {
        "passed": 3,
        "failed": 9
      },
      "understandable": {
        "passed": 1,
        "failed": 1
      },
      "robust": {
        "passed": 10,
        "failed": 30
      }
    },
    "bySeverity": {
      "critical": 34,
      "major": 12,
      "minor": 40,
      "best-practice": 0
    }
  },
  "issues": [
    {
      "id": "color-contrast-0",
      "ruleId": "color-contrast",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "1.4.3",
        "name": "Contrast (Minimum)",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<b>Free Penguins</b>",
        "selector": "tr[height=\"25px\"]:nth-child(2) > td[bgcolor=\"#A9B8BF\"][width=\"150px\"] > font[color=\"#41545D\"][size=\"2\"] > b"
      },
      "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
      "fixSuggestion": "Elements must meet minimum color contrast ratio thresholds",
      "whyItMatters": "Fix any of the following:\n  Element has insufficient color contrast of 3.88 (foreground color: #41545d, background color: #a9b8bf, font size: 9.8pt (13px), font weight: bold). Expected contrast ratio of 4.5:1",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "color-contrast-1",
      "ruleId": "color-contrast",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "1.4.3",
        "name": "Contrast (Minimum)",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<b>More City Parks</b>",
        "selector": "tr[height=\"25px\"]:nth-child(7) > td[bgcolor=\"#A9B8BF\"][width=\"150px\"] > font[color=\"#41545D\"][size=\"2\"] > b"
      },
      "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
      "fixSuggestion": "Elements must meet minimum color contrast ratio thresholds",
      "whyItMatters": "Fix any of the following:\n  Element has insufficient color contrast of 3.88 (foreground color: #41545d, background color: #a9b8bf, font size: 9.8pt (13px), font weight: bold). Expected contrast ratio of 4.5:1",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "html-has-lang-2",
      "ruleId": "html-has-lang",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "3.1.1",
        "name": "Language of Page",
        "level": "A",
        "principle": "understandable"
      },
      "impact": [
        "cognitive"
      ],
      "element": {
        "html": "<html>",
        "selector": "html"
      },
      "description": "Ensure every HTML document has a lang attribute",
      "fixSuggestion": "<html> element must have a lang attribute",
      "whyItMatters": "Fix any of the following:\n  The <html> element does not have a lang attribute",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "image-alt-3",
      "ruleId": "image-alt",
      "source": "axe-core",
      "severity": "critical",
      "wcagCriterion": {
        "number": "1.1.1",
        "name": "Non-text Content",
        "level": "A",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<img src=\"./img/border_left_top.gif\" width=\"10px\" height=\"10px\">",
        "selector": "img[src$=\"border_left_top.gif\"]"
      },
      "description": "Ensure <img> elements have alternative text or a role of none or presentation",
      "fixSuggestion": "Images must have alternative text",
      "whyItMatters": "Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute\n  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "image-alt-4",
      "ruleId": "image-alt",
      "source": "axe-core",
      "severity": "critical",
      "wcagCriterion": {
        "number": "1.1.1",
        "name": "Non-text Content",
        "level": "A",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<img src=\"./img/border_top.gif\" height=\"10px\">",
        "selector": "img[src$=\"border_top.gif\"]"
      },
      "description": "Ensure <img> elements have alternative text or a role of none or presentation",
      "fixSuggestion": "Images must have alternative text",
      "whyItMatters": "Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute\n  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "image-alt-5",
      "ruleId": "image-alt",
      "source": "axe-core",
      "severity": "critical",
      "wcagCriterion": {
        "number": "1.1.1",
        "name": "Non-text Content",
        "level": "A",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<img src=\"./img/border_right_top.gif\" width=\"10px\" height=\"10px\">",
        "selector": "img[src$=\"border_right_top.gif\"]"
      },
      "description": "Ensure <img> elements have alternative text or a role of none or presentation",
      "fixSuggestion": "Images must have alternative text",
      "whyItMatters": "Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute\n  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "landmark-one-main-36",
      "ruleId": "landmark-one-main",
      "source": "axe-core",
      "severity": "minor",
      "wcagCriterion": null,
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<html>",
        "selector": "html"
      },
      "description": "Ensure the document has a main landmark",
      "fixSuggestion": "Document should have one main landmark",
      "whyItMatters": "Fix all of the following:\n  Document does not have a main landmark",
      "needsManualReview": false,
      "applicableFrameworks": []
    },
    {
      "id": "link-name-37",
      "ruleId": "link-name",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "2.4.4",
        "name": "Link Purpose (In Context)",
        "level": "A",
        "principle": "operable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a href=\"javascript:location.href='home.html';\" onfocus=\"blur();\"><img name=\"nav_home\" src=\"./img/nav_home.gif\" width=\"88\" height=\"27\" hspace=\"15\" border=\"0px\"></a>",
        "selector": "#home > a[onfocus=\"blur();\"]"
      },
      "description": "Ensure links have discernible text",
      "fixSuggestion": "Links must have discernible text",
      "whyItMatters": "Fix all of the following:\n  Element is in tab order and does not have accessible text\n\nFix any of the following:\n  Element does not have text that is visible to screen readers\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "link-name-38",
      "ruleId": "link-name",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "2.4.4",
        "name": "Link Purpose (In Context)",
        "level": "A",
        "principle": "operable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a href=\"javascript:location.href='news.html';\" onfocus=\"blur();\"><img src=\"./img/nav_news.gif\" name=\"nav_news\" width=\"90\" height=\"21\" hspace=\"12\" border=\"0px\"></a>",
        "selector": "#news > a[onfocus=\"blur();\"]"
      },
      "description": "Ensure links have discernible text",
      "fixSuggestion": "Links must have discernible text",
      "whyItMatters": "Fix all of the following:\n  Element is in tab order and does not have accessible text\n\nFix any of the following:\n  Element does not have text that is visible to screen readers\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "link-name-39",
      "ruleId": "link-name",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "2.4.4",
        "name": "Link Purpose (In Context)",
        "level": "A",
        "principle": "operable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a href=\"javascript:location.href='tickets.html';\" onfocus=\"blur();\"><img name=\"nav_facts\" src=\"./img/nav_facts.gif\" width=\"105\" height=\"23\" hspace=\"9\" border=\"0px\"></a>",
        "selector": "#tickets > a[onfocus=\"blur();\"]"
      },
      "description": "Ensure links have discernible text",
      "fixSuggestion": "Links must have discernible text",
      "whyItMatters": "Fix all of the following:\n  Element is in tab order and does not have accessible text\n\nFix any of the following:\n  Element does not have text that is visible to screen readers\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "region-44",
      "ruleId": "region",
      "source": "axe-core",
      "severity": "minor",
      "wcagCriterion": null,
      "impact": [
        "motor"
      ],
      "element": {
        "html": "<p id=\"logos\"><a href=\"https://www.w3.org/\" title=\"W3C Home\"><img alt=\"W3C logo\" src=\"../img/w3c.png\" height=\"48\" width=\"72\"></a><a href=\"https://www.w3.org/WAI/\" title=\"WAI Home\"><img alt=\"Web Accessibility Initiative (WAI) logo\" src=\"../img/wai.png\" height=\"48\"></a></p>",
        "selector": "#logos"
      },
      "description": "Ensure all page content is contained by landmarks",
      "fixSuggestion": "All page content should be contained by landmarks",
      "whyItMatters": "Fix any of the following:\n  Some page content is not contained by landmarks",
      "needsManualReview": false,
      "applicableFrameworks": []
    },
    {
      "id": "region-45",
      "ruleId": "region",
      "source": "axe-core",
      "severity": "minor",
      "wcagCriterion": null,
      "impact": [
        "motor"
      ],
      "element": {
        "html": "<h1><span class=\"subhead\">Inaccessible Home Page</span><span class=\"hidden\"> -</span> Before and After Demonstration</h1>",
        "selector": "h1"
      },
      "description": "Ensure all page content is contained by landmarks",
      "fixSuggestion": "All page content should be contained by landmarks",
      "whyItMatters": "Fix any of the following:\n  Some page content is not contained by landmarks",
      "needsManualReview": false,
      "applicableFrameworks": []
    },
    {
      "id": "region-46",
      "ruleId": "region",
      "source": "axe-core",
      "severity": "minor",
      "wcagCriterion": null,
      "impact": [
        "motor"
      ],
      "element": {
        "html": "<p class=\"subline\">Improving a Web site using Web Content Accessibility Guidelines (WCAG) 2.0</p>",
        "selector": ".subline"
      },
      "description": "Ensure all page content is contained by landmarks",
      "fixSuggestion": "All page content should be contained by landmarks",
      "whyItMatters": "Fix any of the following:\n  Some page content is not contained by landmarks",
      "needsManualReview": false,
      "applicableFrameworks": []
    },
    {
      "id": "select-name-66",
      "ruleId": "select-name",
      "source": "axe-core",
      "severity": "critical",
      "wcagCriterion": {
        "number": "4.1.2",
        "name": "Name, Role, Value",
        "level": "A",
        "principle": "robust"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<select onchange=\"location.href = this.value;\">",
        "selector": "select"
      },
      "description": "Ensure select element has an accessible name",
      "fixSuggestion": "Select element must have an accessible name",
      "whyItMatters": "Fix any of the following:\n  Element does not have an implicit (wrapped) <label>\n  Element does not have an explicit <label>\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute\n  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "color-contrast-review-67",
      "ruleId": "color-contrast",
      "source": "axe-core",
      "severity": "major",
      "wcagCriterion": {
        "number": "1.4.3",
        "name": "Contrast (Minimum)",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a class=\"page current\"><span class=\"hidden\">Inaccessible </span>Home Page</a>",
        "selector": ".page.current"
      },
      "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
      "fixSuggestion": "Elements must meet minimum color contrast ratio thresholds",
      "whyItMatters": "Fix any of the following:\n  Element's background color could not be determined due to a background image",
      "needsManualReview": true,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "alt-too-long-69",
      "ruleId": "alt-too-long",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": null,
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<img src=\"./img/top_logo.gif\" width=\"443px\" height=\"86px\" alt=\"Red dot with a white letter 'C' that symbolizes a moon crescent as well as the sun. This logo is followed by a black banner that says 'CI",
        "selector": "img"
      },
      "description": "Alt text is 343 characters. Consider using aria-describedby for detailed descriptions.",
      "fixSuggestion": "Image alt text is too long (>125 characters)",
      "whyItMatters": "Alt text is 343 characters. Consider using aria-describedby for detailed descriptions.",
      "needsManualReview": false,
      "applicableFrameworks": []
    },
    {
      "id": "link-text-generic-70",
      "ruleId": "link-text-generic",
      "source": "custom",
      "severity": "major",
      "wcagCriterion": {
        "number": "2.4.4",
        "name": "Link Purpose (In Context)",
        "level": "A",
        "principle": "operable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a onfocus=\"blur();\" href=\"../offsite.html\" target=\"_blank\">Click here</a>",
        "selector": "a"
      },
      "description": "Link purpose should be determinable from the link text alone (WCAG 2.4.4).",
      "fixSuggestion": "Link text \"click here\" is not descriptive",
      "whyItMatters": "Link purpose should be determinable from the link text alone (WCAG 2.4.4).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "link-text-generic-71",
      "ruleId": "link-text-generic",
      "source": "custom",
      "severity": "major",
      "wcagCriterion": {
        "number": "2.4.4",
        "name": "Link Purpose (In Context)",
        "level": "A",
        "principle": "operable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a onfocus=\"blur();\" href=\"../offsite.html\" target=\"_blank\">Click here</a>",
        "selector": "a"
      },
      "description": "Link purpose should be determinable from the link text alone (WCAG 2.4.4).",
      "fixSuggestion": "Link text \"click here\" is not descriptive",
      "whyItMatters": "Link purpose should be determinable from the link text alone (WCAG 2.4.4).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "text-too-small-72",
      "ruleId": "text-too-small",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.4",
        "name": "Resize Text",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a rel=\"Copyright\" href=\"https://www.w3.org/Consortium/Legal/ipr-notice#Copyright\">Copyright</a>",
        "selector": "a"
      },
      "description": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "fixSuggestion": "5 element(s) have text smaller than 12px",
      "whyItMatters": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "text-too-small-73",
      "ruleId": "text-too-small",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.4",
        "name": "Resize Text",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a href=\"https://www.w3.org/\"><acronym title=\"World Wide Web Consortium\">W3C</acronym></a>",
        "selector": "a"
      },
      "description": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "fixSuggestion": "5 element(s) have text smaller than 12px",
      "whyItMatters": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "text-too-small-74",
      "ruleId": "text-too-small",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.4",
        "name": "Resize Text",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<a href=\"http://www.csail.mit.edu/\"><acronym title=\"Massachusetts Institute of Technology\">MIT</acronym></a>",
        "selector": "a"
      },
      "description": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "fixSuggestion": "5 element(s) have text smaller than 12px",
      "whyItMatters": "Very small text is difficult to read for users with low vision (WCAG 1.4.4).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "line-height-too-tight-77",
      "ruleId": "line-height-too-tight",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.12",
        "name": "Text Spacing",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<p id=\"skipnav\"><a href=\"#page\">Skip to inaccessible demo page</a></p>",
        "selector": "#skipnav"
      },
      "description": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "fixSuggestion": "5 element(s) have line-height less than 1.5",
      "whyItMatters": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "line-height-too-tight-78",
      "ruleId": "line-height-too-tight",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.12",
        "name": "Text Spacing",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<p class=\"subline\">Improving a Web site using Web Content Accessibility Guidelines (WCAG) 2.0</p>",
        "selector": "p.subline"
      },
      "description": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "fixSuggestion": "5 element(s) have line-height less than 1.5",
      "whyItMatters": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "line-height-too-tight-79",
      "ruleId": "line-height-too-tight",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.4.12",
        "name": "Text Spacing",
        "level": "AA",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<li class=\"current first\"><span class=\"hidden\">Current location: </span>Home\n            <div class=\"subnav\"><ul>\n              <li class=\"inaccessible\"><strong>Inaccessible:</strong><a class=\"page cu",
        "selector": "li.current.first"
      },
      "description": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "fixSuggestion": "5 element(s) have line-height less than 1.5",
      "whyItMatters": "Tight line spacing impairs readability, especially for users with cognitive disabilities (WCAG 1.4.12).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "deprecated-html-82",
      "ruleId": "deprecated-html",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "4.1.1",
        "name": "Parsing",
        "level": "A",
        "principle": "robust"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<font color=\"BLACK\" face=\"Verdana\" size=\"2\">&nbsp;&nbsp;<b>Traffic:</b> Construction work on Main Road</font>",
        "selector": "font"
      },
      "description": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "fixSuggestion": "5 deprecated HTML element(s) found",
      "whyItMatters": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "deprecated-html-83",
      "ruleId": "deprecated-html",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "4.1.1",
        "name": "Parsing",
        "level": "A",
        "principle": "robust"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<font color=\"BLACK\" face=\"Verdana\" size=\"2\"><b>Today:</b>\n                <script language=\"JavaScript\">\n                  var now = new Date();\n                  var days = new Array('Sunday', 'Monda",
        "selector": "font"
      },
      "description": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "fixSuggestion": "5 deprecated HTML element(s) found",
      "whyItMatters": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "deprecated-html-84",
      "ruleId": "deprecated-html",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "4.1.1",
        "name": "Parsing",
        "level": "A",
        "principle": "robust"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<font color=\"#41545D\" face=\"Verdana\" size=\"2\">&nbsp;<b>Free Penguins</b></font>",
        "selector": "font"
      },
      "description": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "fixSuggestion": "5 deprecated HTML element(s) found",
      "whyItMatters": "Deprecated elements may not be accessible. Use modern CSS and semantic HTML instead.",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    },
    {
      "id": "landmark-nav-missing-87",
      "ruleId": "landmark-nav-missing",
      "source": "custom",
      "severity": "minor",
      "wcagCriterion": {
        "number": "1.3.1",
        "name": "Info and Relationships",
        "level": "A",
        "principle": "perceivable"
      },
      "impact": [
        "visual"
      ],
      "element": {
        "html": "<body>",
        "selector": "body"
      },
      "description": "Navigation regions should be wrapped in <nav> elements (WCAG 1.3.1).",
      "fixSuggestion": "Page has many links but no <nav> landmark",
      "whyItMatters": "Navigation regions should be wrapped in <nav> elements (WCAG 1.3.1).",
      "needsManualReview": false,
      "applicableFrameworks": [
        "ada-title-ii",
        "ada-title-iii",
        "section-508",
        "california-unruh",
        "eaa",
        "en-301-549",
        "eu-wad",
        "equality-act-2010",
        "aoda",
        "aca",
        "dda-1992",
        "jis-x-8341",
        "rpd-act-2016",
        "korean-ada",
        "nz-web-standards",
        "israel-eq-rights"
      ]
    }
  ],
  "passedRules": 22,
  "passedRuleTags": [
    [
      "cat.aria",
      "wcag2a",
      "wcag131",
      "wcag412",
      "EN-301-549",
      "EN-9.1.3.1",
      "EN-9.4.1.2",
      "RGAAv4",
      "RGAA-10.8.1"
    ],
    [
      "cat.structure",
      "wcag21aa",
      "wcag1412",
      "EN-301-549",
      "EN-9.1.4.12",
      "ACT"
    ],
    [
      "cat.keyboard",
      "wcag2a",
      "wcag241",
      "section508",
      "section508.22.o",
      "TTv5",
      "TT9.a",
      "EN-301-549",
      "EN-9.2.4.1",
      "RGAAv4",
      "RGAA-12.7.1"
    ],
    [
      "cat.color",
      "wcag2aa",
      "wcag143",
      "TTv5",
      "TT13.c",
      "EN-301-549",
      "EN-9.1.4.3",
      "ACT",
      "RGAAv4",
      "RGAA-3.2.1"
    ],
    [
      "cat.text-alternatives",
      "wcag2a",
      "wcag242",
      "TTv5",
      "TT12.a",
      "EN-301-549",
      "EN-9.2.4.2",
      "ACT",
      "RGAAv4",
      "RGAA-8.5.1"
    ],
    [
      "cat.name-role-value",
      "best-practice"
    ],
    [
      "cat.forms",
      "wcag2a",
      "wcag332",
      "TTv5",
      "TT5.c",
      "EN-301-549",
      "EN-9.3.3.2",
      "RGAAv4",
      "RGAA-11.2.1"
    ],
    [
      "cat.semantics",
      "best-practice"
    ],
    [
      "cat.text-alternatives",
      "wcag2a",
      "wcag111",
      "section508",
      "section508.22.a",
      "TTv5",
      "TT7.a",
      "TT7.b",
      "EN-301-549",
      "EN-9.1.1.1",
      "ACT",
      "RGAAv4",
      "RGAA-1.1.1"
    ],
    [
      "cat.text-alternatives",
      "best-practice"
    ],
    [
      "cat.forms",
      "best-practice"
    ],
    [
      "cat.color",
      "wcag2a",
      "wcag141",
      "TTv5",
      "TT13.a",
      "EN-301-549",
      "EN-9.1.4.1",
      "RGAAv4",
      "RGAA-10.6.1"
    ],
    [
      "cat.name-role-value",
      "wcag2a",
      "wcag244",
      "wcag412",
      "section508",
      "section508.22.a",
      "TTv5",
      "TT6.a",
      "EN-301-549",
      "EN-9.2.4.4",
      "EN-9.4.1.2",
      "ACT",
      "RGAAv4",
      "RGAA-6.2.1"
    ],
    [
      "cat.structure",
      "wcag2a",
      "wcag131",
      "EN-301-549",
      "EN-9.1.3.1",
      "RGAAv4",
      "RGAA-9.3.1"
    ],
    [
      "cat.structure",
      "wcag2a",
      "wcag131",
      "EN-301-549",
      "EN-9.1.3.1",
      "RGAAv4",
      "RGAA-9.3.1"
    ],
    [
      "cat.keyboard",
      "wcag2a",
      "wcag412",
      "TTv5",
      "TT6.a",
      "EN-301-549",
      "EN-9.4.1.2",
      "RGAAv4",
      "RGAA-7.1.1"
    ],
    [
      "cat.semantics",
      "best-practice"
    ],
    [
      "cat.aria",
      "best-practice",
      "ACT"
    ],
    [
      "cat.keyboard",
      "best-practice",
      "RGAAv4",
      "RGAA-9.2.1"
    ],
    [
      "cat.keyboard",
      "best-practice",
      "RGAAv4",
      "RGAA-12.7.1"
    ],
    [
      "cat.tables",
      "best-practice",
      "RGAAv4",
      "RGAA-5.2.1"
    ],
    [
      "cat.tables",
      "wcag2a",
      "wcag131",
      "section508",
      "section508.22.g",
      "TTv5",
      "TT14.b",
      "EN-301-549",
      "EN-9.1.3.1",
      "RGAAv4",
      "RGAA-5.7.4"
    ]
  ],
  "incompleteRules": 1,
  "inapplicableRules": 64,
  "totalRulesRun": 94
} as ScanResult;
