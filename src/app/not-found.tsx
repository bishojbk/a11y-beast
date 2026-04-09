import Link from "next/link";
import { LogoIcon } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="aurora-hero flex flex-col min-h-screen items-center justify-center px-6 text-center">
      <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8" style={{ filter: "drop-shadow(0 0 16px rgba(139,92,246,0.5))" }}>
          <LogoIcon size={64} />
        </div>
        <h1 className="text-6xl font-extrabold mb-3 gradient-text" style={{ fontFamily: "var(--font-display)" }}>404</h1>
        <p className="text-lg mb-2 font-semibold" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>Page not found</p>
        <p className="text-sm mb-10 max-w-md" style={{ color: "var(--text-tertiary)" }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <Link href="/"
          className="scan-btn h-12 px-7 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          style={{ color: "var(--text-inverse)" }}>
          <span>Back to Scanner</span>
        </Link>
      </div>
    </div>
  );
}
