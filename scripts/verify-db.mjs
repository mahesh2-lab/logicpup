import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
});

async function verify() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log("Database tables found in PostgreSQL (app):");
    res.rows.forEach((r) => console.log(" - " + r.table_name));
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
