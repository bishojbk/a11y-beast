import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export type Plan = "free" | "pro" | "agency";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  plan: text("plan").$type<Plan>().notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planRenewsAt: timestamp("plan_renews_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
);

export const evidenceRecords = pgTable(
  "evidence_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    siteHost: text("site_host").notNull(),
    siteUrl: text("site_url").notNull(),
    contentHash: text("content_hash").notNull(),
    scanDate: timestamp("scan_date", { withTimezone: true }).notNull(),
    record: jsonb("record").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("evidence_user_site_idx").on(t.userId, t.siteHost, t.createdAt)]
);

export type UserRow = typeof users.$inferSelect;
export type EvidenceRow = typeof evidenceRecords.$inferSelect;
