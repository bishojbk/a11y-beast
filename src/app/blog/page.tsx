import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/ui/PageContainer";
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
    <PageContainer>
      <div className="doc-eyebrow">Blog · accessibility &amp; the law</div>
      <h1 className="doc-title">Accessibility law, in plain English.</h1>
      <p className="doc-lead" style={{ marginBottom: 40 }}>
        What the laws actually require, how to check your own site, and why “instant compliance” is a myth.
      </p>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="post-row">
              <div className="post-meta">
                <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.readingMinutes} min read
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-dek">{post.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
