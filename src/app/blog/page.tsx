import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Plain-English guides to web accessibility law and how to check your site — the European Accessibility Act, ADA Title III, WCAG, and what automated scanning can and can't tell you.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main
        id="main-content"
        className="page-enter"
        role="main"
        style={{ flex: 1, maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px", width: "100%" }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 12 }} className="mono">
          Blog · accessibility &amp; the law
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.05, marginBottom: 16 }}>
          Accessibility law, in plain English.
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.6, maxWidth: "62ch", marginBottom: 48 }}>
          What the laws actually require, how to check your own site, and why &ldquo;instant
          compliance&rdquo; is a myth.
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  display: "block",
                  padding: "22px 0",
                  borderTop: "1px solid var(--border-faint)",
                  color: "inherit",
                }}
              >
                <div className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 8 }}>
                  <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.readingMinutes} min read
                </div>
                <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1.25, marginBottom: 8, color: "var(--text-primary)" }}>
                  {post.title}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>
                  {post.dek}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
