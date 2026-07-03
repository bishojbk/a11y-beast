import type { Metadata } from "next";
import { Suspense } from "react";
import PageContainer from "@/components/ui/PageContainer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your A11y Beast account.",
  robots: { index: false },
};

export default function SigninPage() {
  return (
    <PageContainer>
      <div className="doc-eyebrow">Account · sign in</div>
      <h1 className="doc-title" style={{ marginBottom: 10 }}>
        Sign in
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, maxWidth: "58ch", marginBottom: 28 }}>
        Your scan history, evidence ledger, and plan live here.
      </p>
      <Suspense>
        <AuthForm mode="signin" />
      </Suspense>
    </PageContainer>
  );
}
