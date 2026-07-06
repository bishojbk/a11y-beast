import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import AuthForm from "@/components/AuthForm";
import { ACCOUNTS_ENABLED } from "@/lib/features";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free A11y Beast account to keep a dated evidence ledger for your sites.",
  robots: { index: false },
};

export default function SignupPage() {
  if (!ACCOUNTS_ENABLED) notFound();
  return (
    <PageContainer>
      <div className="doc-eyebrow">Account · create</div>
      <h1 className="doc-title" style={{ marginBottom: 10 }}>
        Create your account
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, maxWidth: "58ch", marginBottom: 28 }}>
        Free. An account keeps your scan history and evidence records in one place instead of a single
        browser&rsquo;s storage — and it&rsquo;s where Pro features live as they ship.
      </p>
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </PageContainer>
  );
}
