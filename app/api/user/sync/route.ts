import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";
import { jsonSuccess, jsonError } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;
    if (!userId) {
      return jsonSuccess({
        authenticated: false,
        projects: [],
        collections: [],
        completedChallengeIds: [],
        user: null,
      });
    }

    // 1. Fetch User Projects
    const projectsResult = await pool.query(
      `SELECT * FROM "project" WHERE "ownerId" = $1 ORDER BY "updatedAt" DESC`,
      [userId]
    );

    const projectIds = projectsResult.rows.map((p: { id: string }) => p.id);

    // 2. Fetch Project Files, Runs, Activities
    let files: Array<{ id: string; projectId: string; path: string; name: string; content: string; language: string; isMain: boolean; updatedAt: string }> = [];
    let runs: Array<{ id: string; projectId: string; runNumber: number; status: string; durationMs: number; output: unknown; variables: unknown; error?: string; timestamp: string }> = [];
    let activities: Array<{ id: string; projectId: string; type: string; description: string; timestamp: string }> = [];

    if (projectIds.length > 0) {
      const filesResult = await pool.query(
        `SELECT * FROM "project_file" WHERE "projectId" = ANY($1::text[])`,
        [projectIds]
      );
      files = filesResult.rows;

      const runsResult = await pool.query(
        `SELECT * FROM "project_run" WHERE "projectId" = ANY($1::text[]) ORDER BY "timestamp" DESC LIMIT 100`,
        [projectIds]
      );
      runs = runsResult.rows;

      const actResult = await pool.query(
        `SELECT * FROM "project_activity" WHERE "projectId" = ANY($1::text[]) ORDER BY "timestamp" DESC LIMIT 100`,
        [projectIds]
      );
      activities = actResult.rows;
    }

    // Format full project objects
    const fullProjects = projectsResult.rows.map((p: {
      id: string;
      name: string;
      description: string;
      language: string;
      templateId: string;
      status: string;
      progress: number;
      ownerId: string;
      visualProgram: { nodes: unknown[]; edges: unknown[] } | string;
      settings: Record<string, unknown> | string;
      createdAt: string;
      updatedAt: string;
      lastEditedAt: string;
    }) => {
      const visualProgram = typeof p.visualProgram === "string" ? JSON.parse(p.visualProgram) : p.visualProgram || { nodes: [], edges: [] };
      const settings = typeof p.settings === "string" ? JSON.parse(p.settings) : p.settings || {};

      return {
        ...p,
        visualProgram,
        settings,
        files: files.filter((f) => f.projectId === p.id),
        runs: runs.filter((r) => r.projectId === p.id),
        activity: activities.filter((a) => a.projectId === p.id),
      };
    });

    // 3. Fetch User Collections & Memberships
    const collectionsResult = await pool.query(
      `SELECT * FROM "collection" WHERE "ownerId" = $1 ORDER BY "updatedAt" DESC`,
      [userId]
    );

    const collectionIds = collectionsResult.rows.map((c: { id: string }) => c.id);
    let memberships: Array<{ projectId: string; collectionId: string }> = [];

    if (collectionIds.length > 0) {
      const memResult = await pool.query(
        `SELECT * FROM "project_collection" WHERE "collectionId" = ANY($1::text[])`,
        [collectionIds]
      );
      memberships = memResult.rows;
    }

    const fullCollections = collectionsResult.rows.map((c: {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
      createdAt: string;
      updatedAt: string;
    }) => ({
      ...c,
      projectIds: memberships
        .filter((m) => m.collectionId === c.id)
        .map((m) => m.projectId),
    }));

    // 4. Fetch Completed Challenge IDs
    const challengesResult = await pool.query(
      `SELECT "challengeId" FROM "user_challenge" WHERE "userId" = $1 AND "completed" = true`,
      [userId]
    );
    const completedChallengeIds = challengesResult.rows.map((r: { challengeId: string }) => r.challengeId);

    return jsonSuccess({
      authenticated: true,
      user: session.user,
      projects: fullProjects,
      collections: fullCollections,
      completedChallengeIds,
    });
  } catch (error) {
    // Return guest/local mode fallback without 500 error when PostgreSQL is not running
    return jsonSuccess({
      authenticated: false,
      projects: [],
      collections: [],
      completedChallengeIds: [],
      user: null,
      offline: true,
    });
  }
}

