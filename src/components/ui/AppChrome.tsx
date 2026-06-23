"use client";

import { MotionConfig } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

// Single source of the page chrome: the skip link, the global Header, the global
// Footer, and a site-wide reduced-motion default. Rendered once by the root
// layout so every route gets identical chrome — pages only supply their <main>.
// Pages keep their own <main id="main-content"> (the skip-link target) and their
// own page-specific JSON-LD.
export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      {children}
      <Footer />
    </MotionConfig>
  );
}
