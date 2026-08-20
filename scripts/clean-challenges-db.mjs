import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
});

async function cleanChallengesFromDatabase() {
  console.log("Connecting to PostgreSQL to clean challenge projects...");

  try {
    const client = await pool.connect();
    console.log("Connected to database successfully.");

    // 1. Identify and delete challenge project rows from "project" and child tables
    const deleteFilesQuery = `
      DELETE FROM "project_file"
      WHERE "projectId" = 'challenge-sandbox'
         OR "projectId" LIKE 'proj_challenge%'
         OR "projectId" IN (
           SELECT "id" FROM "project"
           WHERE "name" ILIKE '%Challenge%'
              OR "name" ILIKE '%Score Keeper%'
              OR "name" ILIKE '%Create & Print Your Age%'
              OR "name" ILIKE '%Level %'
              OR "id" = 'challenge-sandbox'
              OR "id" LIKE 'proj_challenge%'
         );
    `;

    const deleteRunsQuery = `
      DELETE FROM "project_run"
      WHERE "projectId" = 'challenge-sandbox'
         OR "projectId" LIKE 'proj_challenge%'
         OR "projectId" IN (
           SELECT "id" FROM "project"
           WHERE "name" ILIKE '%Challenge%'
              OR "name" ILIKE '%Score Keeper%'
              OR "name" ILIKE '%Create & Print Your Age%'
              OR "name" ILIKE '%Level %'
              OR "id" = 'challenge-sandbox'
              OR "id" LIKE 'proj_challenge%'
         );
    `;

    const deleteActivityQuery = `
      DELETE FROM "project_activity"
      WHERE "projectId" = 'challenge-sandbox'
         OR "projectId" LIKE 'proj_challenge%'
         OR "projectId" IN (
           SELECT "id" FROM "project"
           WHERE "name" ILIKE '%Challenge%'
              OR "name" ILIKE '%Score Keeper%'
              OR "name" ILIKE '%Create & Print Your Age%'
              OR "name" ILIKE '%Level %'
              OR "id" = 'challenge-sandbox'
              OR "id" LIKE 'proj_challenge%'
         );
    `;

    const deleteProjectCollectionQuery = `
      DELETE FROM "project_collection"
      WHERE "projectId" = 'challenge-sandbox'
         OR "projectId" LIKE 'proj_challenge%'
         OR "projectId" IN (
           SELECT "id" FROM "project"
           WHERE "name" ILIKE '%Challenge%'
              OR "name" ILIKE '%Score Keeper%'
              OR "name" ILIKE '%Create & Print Your Age%'
              OR "name" ILIKE '%Level %'
              OR "id" = 'challenge-sandbox'
              OR "id" LIKE 'proj_challenge%'
         );
    `;

    const deleteProjectsQuery = `
      DELETE FROM "project"
      WHERE "id" = 'challenge-sandbox'
         OR "id" LIKE 'proj_challenge%'
         OR "name" ILIKE '%Challenge%'
         OR "name" ILIKE '%Score Keeper%'
         OR "name" ILIKE '%Create & Print Your Age%'
         OR "name" ILIKE '%Level %'
      RETURNING "id", "name";
    `;

    await client.query("BEGIN");

    await client.query(deleteFilesQuery);
    await client.query(deleteRunsQuery);
    await client.query(deleteActivityQuery);
    await client.query(deleteProjectCollectionQuery);

    const deletedProjects = await client.query(deleteProjectsQuery);

    await client.query("COMMIT");
    client.release();

    console.log(`Successfully purged ${deletedProjects.rowCount} challenge projects from database:`);
    deletedProjects.rows.forEach((p) => {
      console.log(` - [${p.id}] ${p.name}`);
    });
    console.log("All challenges removed from PostgreSQL projects table.");
  } catch (err) {
    console.warn("Could not connect to PostgreSQL or clean database:", err.message);
  } finally {
    await pool.end();
  }
}

cleanChallengesFromDatabase();
