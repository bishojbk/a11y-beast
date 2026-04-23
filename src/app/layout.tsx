import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Inlined into <body> so the theme attribute is applied before any painted
// children mount, preventing a light/dark flash. Kept self-contained so it
// runs whether or not hydration has begun.
const THEME_INIT = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A11y Beast — You're not just failing WCAG. You're breaking 16 laws.",
  description:
    "Free accessibility scanner with teeth. 125+ rules, 16 legal frameworks (ADA, EAA, UK Equality Act, Section 508, Unruh), real browser rendering. One scan, sixteen verdicts.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {children}
        <footer style={{ textAlign: "center", padding: "16px", fontSize: "13px", opacity: 0.6 }}>
          Made by <a href="https://github.com/bishojbk" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>EJR</a>
        </footer>
      </body>
    </html>
  );
}
