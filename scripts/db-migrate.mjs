/* Applies src/lib/db/ddl.ts (idempotent DDL) to the Postgres at DATABASE_URL.
   Usage: DATABASE_URL=postgres://... node scripts/db-migrate.mjs            */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const ddlSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../src/lib/db/ddl.ts"),
  "utf8"
);
const match = ddlSource.match(/`([\s\S]*)`/);
if (!match) {
  console.error("Could not extract DDL from src/lib/db/ddl.ts");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query(match[1]);
  console.log("Migration applied.");
} finally {
  await client.end();
}
