import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { DDL } from "./ddl";

export type Db = NodePgDatabase<typeof schema>;

// One DB handle per server process. With DATABASE_URL set (prod: Neon/Vercel
// Postgres, or any Postgres) we use node-postgres. Without it, dev falls back
// to an embedded PGlite store in .dev-db/ — zero setup, auto-migrated — so the
// whole account/billing/ledger stack runs locally with no credentials.
declare global {
  // eslint-disable-next-line no-var
  var __abDbPromise: Promise<Db> | undefined;
}

async function init(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pool = new Pool({ connectionString: url, max: 3 });
    return drizzle(pool, { schema });
  }
  if (process.env.VERCEL) {
    throw new Error("DATABASE_URL is not set — provision Postgres and set it before enabling accounts.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const client = new PGlite(".dev-db");
  await client.exec(DDL);
  // Same PG dialect, same query API — the cast only bridges the driver types.
  return drizzle(client, { schema }) as unknown as Db;
}

export function getDb(): Promise<Db> {
  if (!globalThis.__abDbPromise) globalThis.__abDbPromise = init();
  return globalThis.__abDbPromise;
}

export * from "./schema";
