import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pool?: Pool;
};

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString:
      process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}
