import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import SignOutButton from "@/components/SignOutButton";
import ManageBillingButton from "@/components/ManageBillingButton";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Account",
  description: "Your A11y Beast account: plan, billing, and evidence ledger.",
  robots: { index: false },
};

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  agency: "Agency (founding)",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/signin?next=/account");
  const { upgraded } = await searchParams;

  return (
    <PageContainer>
      <div className="doc-eyebrow">Account</div>
      <h1 className="doc-title" style={{ marginBottom: 10 }}>
        Your account
      </h1>
      <p className="mono" style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 28 }}>
        {user.email} · member since{" "}
        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      {upgraded && (
        <p
          role="status"
          style={{
            border: "1px solid var(--accent-line)",
            background: "var(--accent-wash)",
            color: "var(--accent-text)",
            borderRadius: 6,
            padding: "12px 16px",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          Payment received — your plan updates within a minute of Stripe&rsquo;s confirmation. Thank you.
        </p>
      )}

      <section aria-labelledby="account-plan" style={{ marginBottom: 32 }}>
        <h2 id="account-plan" className="font-display" style={{ fontSize: 20, marginBottom: 10 }}>
          Plan
        </h2>
        <p style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <span className="tier-pill">{PLAN_LABEL[user.plan] ?? user.plan}</span>
          {user.plan === "free" ? (
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Free covers single-page scans and the full 16-framework diagnosis, always.
            </span>
          ) : user.planRenewsAt ? (
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Renews {new Date(user.planRenewsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
            </span>
          ) : null}
        </p>
        {user.plan === "free" ? (
          <Link href="/pricing" className="btn" style={{ display: "inline-flex" }}>
            See plans
          </Link>
        ) : (
          <ManageBillingButton />
        )}
      </section>

      <section aria-labelledby="account-evidence" style={{ marginBottom: 32 }}>
        <h2 id="account-evidence" className="font-display" style={{ fontSize: 20, marginBottom: 10 }}>
          Evidence ledger
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, maxWidth: "62ch" }}>
          Evidence records you generate on the results page are kept in this browser today. Account-backed
          storage — your ledger available on any device — ships next as part of Pro.
        </p>
      </section>

      <SignOutButton />
    </PageContainer>
  );
}
