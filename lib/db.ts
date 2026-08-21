import { Pool } from "pg";
import { env } from "./env";

const globalForPg = globalThis as unknown as {
  pool?: Pool;
};

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: env.DATABASE_URL,
  });


if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}
