import type { Metadata } from "next";
import Script from "next/script";
import { Newsreader, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Runs before the page is interactive (via next/script beforeInteractive), so a
// saved theme preference is applied before paint — no light/dark flash. <html>
// already defaults to data-theme="dark", so this only needs to override to a
// saved non-default preference.
const THEME_INIT = `try{var t=localStorage.getItem("theme");if(t&&t!=="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

// Forensic-editorial type system: Newsreader (display serif),
// Archivo (UI grotesk), IBM Plex Mono (data / code / legal tags).
const newsreader = Newsreader({
  variable: "--font-newsreader",
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
const TITLE = "A11y Beast — you're not just failing WCAG. You're breaking 16 laws.";
const DESCRIPTION =
  "Free forensic accessibility scanner. 125+ checks in a real browser, every violation mapped to 16 legal frameworks (ADA, EAA, Section 508, California Unruh + more). One scan, sixteen verdicts — not an overlay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
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
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${archivo.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        {children}
        <footer style={{ textAlign: "center", padding: "16px", fontSize: "13px", opacity: 0.6 }}>
          Made by <a href="https://github.com/bishojbk" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>EJR</a>
        </footer>
      </body>
    </html>
  );
}
