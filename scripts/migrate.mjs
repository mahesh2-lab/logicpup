import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
});

const schema = `
-- ─────────────────────────────────────────────────────────────────────────────
-- Better Auth Core Tables (v1.7.x Schema)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "issuer" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure issuer column exists if account table was already created
ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" TEXT;

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CodeFlow Project Tables
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT DEFAULT '',
  "language" TEXT NOT NULL DEFAULT 'python',
  "templateId" TEXT NOT NULL DEFAULT 'empty',
  "status" TEXT NOT NULL DEFAULT 'active',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "ownerId" TEXT REFERENCES "user"("id") ON DELETE SET NULL,
  "visualProgram" JSONB NOT NULL DEFAULT '{"nodes":[], "edges":[]}',
  "settings" JSONB NOT NULL DEFAULT '{"autoSave": true, "formatOnSave": true, "visibility": "private"}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastEditedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "project_file" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "path" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "content" TEXT NOT NULL DEFAULT '',
  "language" TEXT NOT NULL DEFAULT 'python',
  "isMain" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "project_run" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "runNumber" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'success',
  "durationMs" INTEGER NOT NULL DEFAULT 0,
  "output" JSONB NOT NULL DEFAULT '[]',
  "variables" JSONB NOT NULL DEFAULT '{}',
  "error" TEXT,
  "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "project_activity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL DEFAULT 'saved',
  "description" TEXT NOT NULL,
  "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Collections, Classrooms & Tasks
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "collection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT DEFAULT '',
  "icon" TEXT NOT NULL DEFAULT '📁',
  "color" TEXT NOT NULL DEFAULT '#F26A3D',
  "ownerId" TEXT REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "project_collection" (
  "projectId" TEXT NOT NULL REFERENCES "project"("id") ON DELETE CASCADE,
  "collectionId" TEXT NOT NULL REFERENCES "collection"("id") ON DELETE CASCADE,
  "addedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("projectId", "collectionId")
);

CREATE TABLE IF NOT EXISTS "classroom" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL UNIQUE,
  "teacherName" TEXT NOT NULL DEFAULT 'Teacher',
  "description" TEXT DEFAULT '',
  "icon" TEXT NOT NULL DEFAULT '🏫',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "classroom_task" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "classroomId" TEXT NOT NULL REFERENCES "classroom"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT DEFAULT '',
  "templateId" TEXT NOT NULL DEFAULT 'guessing-game',
  "dueDate" TEXT,
  "points" INTEGER NOT NULL DEFAULT 100,
  "status" TEXT NOT NULL DEFAULT 'assigned',
  "projectId" TEXT REFERENCES "project"("id") ON DELETE SET NULL,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "user_challenge" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "challengeId" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP,
  UNIQUE ("userId", "challengeId")
);

-- Indices
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "idx_project_ownerId" ON "project"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_project_file_projectId" ON "project_file"("projectId");
CREATE INDEX IF NOT EXISTS "idx_project_run_projectId" ON "project_run"("projectId");
CREATE INDEX IF NOT EXISTS "idx_project_activity_projectId" ON "project_activity"("projectId");
CREATE INDEX IF NOT EXISTS "idx_collection_ownerId" ON "collection"("ownerId");
CREATE INDEX IF NOT EXISTS "idx_classroom_code" ON "classroom"("code");
CREATE INDEX IF NOT EXISTS "idx_classroom_task_classroomId" ON "classroom_task"("classroomId");
`;

async function main() {
  console.log("Connecting to PostgreSQL database at:", pool.options.connectionString);
  const client = await pool.connect();
  try {
    console.log("Applying Better Auth & Project schema migrations...");
    await client.query(schema);
    console.log("✓ All database migrations applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
