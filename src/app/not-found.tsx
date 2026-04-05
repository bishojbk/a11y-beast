import Link from "next/link";
import { LogoIcon } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center">
      <div className="mb-6" style={{ filter: "drop-shadow(0 0 12px rgba(99,102,241,0.4))" }}>
        <LogoIcon size={64} />
      </div>
      <h1 className="text-5xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>404</h1>
      <p className="text-lg mb-2" style={{ color: "var(--text-secondary)" }}>Page not found</p>
      <p className="text-sm mb-8 max-w-md" style={{ color: "var(--text-tertiary)" }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link href="/"
        className="h-11 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition-all"
        style={{ background: "var(--accent)", color: "var(--text-inverse)", boxShadow: "var(--shadow-glow)" }}>
        Back to Scanner
      </Link>
    </div>
  );
}
