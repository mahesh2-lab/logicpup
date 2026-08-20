import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
});

async function resetAllData() {
  console.log("Connecting to PostgreSQL to wipe all data...");

  try {
    const client = await pool.connect();
    console.log("Connected to database successfully.");

    await client.query("BEGIN");

    // Truncate all tables with CASCADE
    const truncateQuery = `
      TRUNCATE TABLE
        "project_activity",
        "project_run",
        "project_file",
        "project_collection",
        "collection",
        "project",
        "user_challenge",
        "session",
        "account",
        "verification",
        "user"
      RESTART IDENTITY CASCADE;
    `;

    try {
      await client.query(truncateQuery);
      console.log("Successfully truncated all core tables.");
    } catch (e) {
      console.warn("Bulk truncate encountered an issue, trying individual table truncates:", e.message);

      const tables = [
        "project_activity",
        "project_run",
        "project_file",
        "project_collection",
        "collection",
        "project",
        "user_challenge",
        "session",
        "account",
        "verification",
        "user"
      ];

      for (const t of tables) {
        try {
          await client.query(`TRUNCATE TABLE "${t}" CASCADE;`);
          console.log(` - Truncated "${t}"`);
        } catch (tblErr) {
          console.warn(` - Table "${t}" skipped or not found:`, tblErr.message);
        }
      }
    }

    await client.query("COMMIT");
    client.release();
    console.log("Database reset complete. All data has been removed.");
  } catch (err) {
    console.warn("Could not connect to PostgreSQL:", err.message);
  } finally {
    await pool.end();
  }
}

resetAllData();
