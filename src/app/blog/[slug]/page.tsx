import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
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
      <PageContainer>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/blog" className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
            ← Blog
          </Link>
        </nav>

        <article className="stagger-in">
          <div className="post-meta" style={{ marginBottom: 14 }}>
            <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.readingMinutes} min read
          </div>
          <h1 className="doc-title" style={{ fontSize: "clamp(30px, 4.5vw, 46px)", lineHeight: 1.08 }}>
            {post.title}
          </h1>
          <Body />
        </article>

        <div className="cta-band">
          <Link href="/#scan" className="scan-btn btn-lg">
            Scan your site for legal risk
          </Link>
          <Link href="/blog" className="btn-lg outline">
            More guides
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
