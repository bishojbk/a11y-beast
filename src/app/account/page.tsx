import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import { ACCOUNTS_ENABLED } from "@/lib/features";
import SignOutButton from "@/components/SignOutButton";
import ManageBillingButton from "@/components/ManageBillingButton";
import BrandingForm from "@/components/BrandingForm";
import { getSessionUser } from "@/lib/auth/session";
import { getDb, evidenceRecords, type Plan } from "@/lib/db";
import { count, desc, eq, max } from "drizzle-orm";

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
  if (!ACCOUNTS_ENABLED) notFound();
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
        <LedgerSummary userId={user.id} plan={user.plan} />
      </section>

      {user.plan === "agency" && (
        <section aria-labelledby="account-brand" style={{ marginBottom: 32 }}>
          <h2 id="account-brand" className="font-display" style={{ fontSize: 20, marginBottom: 10 }}>
            White-label
          </h2>
          <BrandingForm initial={user.brandName ?? ""} />
        </section>
      )}

      <SignOutButton />
    </PageContainer>
  );
}

const SITE_LIMITS: Record<Plan, number> = { free: 1, pro: 3, agency: 25 };

async function LedgerSummary({ userId, plan }: { userId: string; plan: Plan }) {
  const db = await getDb();
  const sites = await db
    .select({
      host: evidenceRecords.siteHost,
      n: count(),
      latest: max(evidenceRecords.createdAt),
    })
    .from(evidenceRecords)
    .where(eq(evidenceRecords.userId, userId))
    .groupBy(evidenceRecords.siteHost)
    .orderBy(desc(max(evidenceRecords.createdAt)));

  if (!sites.length) {
    return (
      <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, maxWidth: "62ch" }}>
        No server-backed records yet. Scan a page and open its <b style={{ color: "var(--text-primary)" }}>Evidence file</b> —
        while you&rsquo;re signed in, every record is stored here too, available on any device.
      </p>
    );
  }

  return (
    <div>
      <ul style={{ listStyle: "none", margin: "0 0 10px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {sites.map((s) => (
          <li
            key={s.host}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              border: "1px solid var(--border-default)",
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 13.5,
            }}
          >
            <span className="mono" style={{ color: "var(--text-primary)" }}>{s.host}</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {s.n} record{s.n === 1 ? "" : "s"}
              {s.latest &&
                ` · latest ${new Date(s.latest).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
            </span>
          </li>
        ))}
      </ul>
      <p className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
        {sites.length} of {SITE_LIMITS[plan] ?? 1} site{(SITE_LIMITS[plan] ?? 1) === 1 ? "" : "s"} on your plan
      </p>
    </div>
  );
}
