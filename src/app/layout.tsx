import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import AnalyticsInit from "@/components/AnalyticsInit";
import AppChrome from "@/components/ui/AppChrome";
import { Fraunces, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Inline no-flash theme script. Rendered as a raw <script dangerouslySetInnerHTML>
// (NOT next/script) so React SSRs it into the initial HTML and the browser runs
// it synchronously during parse — before AppChrome paints — applying the saved
// theme with no light/dark flash. Using next/script beforeInteractive with inline
// *children* triggers a React warning (script children don't execute on the
// client), and beforeInteractive is meant for external src= scripts anyway.
// <html> now defaults to the light "warm paper" theme (:root), so this only
// overrides to a saved dark preference.
const THEME_INIT = `try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

// "The Record" editorial type system: Fraunces (display serif, real italics),
// Archivo (UI grotesk), IBM Plex Mono (data / code / legal tags only).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://accesslens-green.vercel.app";
// SEO_TITLE is the keyword-led <title> shown in search results and the browser tab —
// it targets the real head terms people search ("free accessibility checker", ADA, WCAG),
// surfaced from Google Autocomplete demand data (see docs/seo-keyword-map.md).
// BRAND_TITLE is the distinctive hook reserved for SOCIAL shares (og/twitter), where
// curiosity converts better than keywords. Splitting the two gets both: ranking + swagger.
const SEO_TITLE = "Free Accessibility Checker for ADA & WCAG | A11y Beast";
const BRAND_TITLE = "A11y Beast — the record that proves you tried.";
const DESCRIPTION =
  "Free accessibility checker that maps every WCAG violation to 16 laws — ADA, EAA, Section 508, California Unruh and more. 110+ checks in a real browser. Not an overlay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: "%s — A11y Beast",
  },
  description: DESCRIPTION,
  keywords: [
    "accessibility scanner", "WCAG", "ADA compliance", "European Accessibility Act", "EAA",
    "Section 508", "axe-core", "a11y", "web accessibility audit", "legal compliance",
  ],
  authors: [{ name: "A11y Beast" }],
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "A11y Beast",
    title: BRAND_TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  verification: { google: "UnT56T30lPgyph3b4kT_yHtkAs0P228Vx6NvQJAIDzY" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <AppChrome>{children}</AppChrome>
        <AnalyticsInit />
        <Analytics />
      </body>
    </html>
  );
}
