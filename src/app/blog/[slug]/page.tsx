import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import JsonLd from "@/components/JsonLd";
import { getAllPosts, getPost } from "@/lib/blog/posts";
import { buildBlogPostingLd, buildBreadcrumbLd } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.datePublished,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { Body } = post;

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingLd(post),
          buildBreadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main
        id="main-content"
        className="stagger-in"
        role="main"
        style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "56px 24px 96px", width: "100%" }}
      >
        <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/blog" className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            ← Blog
          </Link>
        </nav>

        <article className="stagger-in">
          <div className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>
            <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.readingMinutes} min read
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(30px, 4.5vw, 46px)", lineHeight: 1.08, marginBottom: 20 }}>
            {post.title}
          </h1>
          <Body />
        </article>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--border-faint)" }}>
          <Link href="/" className="scan-btn" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 22px", borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
            Scan your site for legal risk
          </Link>
        </div>
      </main>
    </>
  );
}
