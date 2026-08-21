import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";
import { jsonSuccess, jsonError } from "@/lib/validation";
import { z } from "zod";

const visualProgramSchema = z.object({
  nodes: z.array(z.any()).optional().default([]),
  edges: z.array(z.any()).optional().default([]),
});

const putProjectSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
  visualProgram: visualProgramSchema.optional().nullable(),
  settings: z.record(z.string(), z.any()).optional(),
  progress: z.number().optional(),
  status: z.string().optional(),
  files: z.array(z.record(z.string(), z.any())).optional(),
  run: z.record(z.string(), z.any()).optional(),
  activity: z.record(z.string(), z.any()).optional(),
});
interface RouteParams {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const result = await pool.query(
      `SELECT * FROM "project" WHERE "id" = $1 LIMIT 1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return jsonError("Project not found", 404);
    }

    const project = result.rows[0];

    // Authorization check
    if (project.ownerId && project.ownerId !== session?.user?.id) {
      const settings = typeof project.settings === "string" ? JSON.parse(project.settings) : project.settings || {};
      if (settings.visibility === "private") {
        return jsonError("Forbidden: You do not have access to this project", 403);
      }
    }

    // Fetch related files, runs, activity concurrently
    const [filesResult, runsResult, actResult] = await Promise.all([
      pool.query(`SELECT * FROM "project_file" WHERE "projectId" = $1`, [projectId]),
      pool.query(`SELECT * FROM "project_run" WHERE "projectId" = $1 ORDER BY "timestamp" DESC LIMIT 50`, [projectId]),
      pool.query(`SELECT * FROM "project_activity" WHERE "projectId" = $1 ORDER BY "timestamp" DESC LIMIT 50`, [projectId])
    ]);

    const visualProgram = typeof project.visualProgram === "string" ? JSON.parse(project.visualProgram) : project.visualProgram;
    const settings = typeof project.settings === "string" ? JSON.parse(project.settings) : project.settings;

    return jsonSuccess({
      project: {
        ...project,
        visualProgram,
        settings,
        files: filesResult.rows,
        runs: runsResult.rows,
        activity: actResult.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return jsonError("Failed to fetch project", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const body = await request.json();
    const parsedBody = putProjectSchema.safeParse(body);
    
    if (!parsedBody.success) {
      return jsonError("Invalid request data", 400, parsedBody.error.format());
    }
    
    const { name, description, visualProgram, settings, progress, status, files, run, activity } = parsedBody.data;

    // Check project existence & ownership
    const existing = await pool.query(
      `SELECT "ownerId" FROM "project" WHERE "id" = $1 LIMIT 1`,
      [projectId]
    );

    if (existing.rows.length === 0) {
      // If it doesn't exist yet in DB, create it
      const insertQuery = `
        INSERT INTO "project" (
          "id", "name", "description", "ownerId", "visualProgram", "settings", "progress", "status", "updatedAt", "lastEditedAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `;
      const insertValues = [
        projectId,
        name || "Python Project",
        description || "",
        session?.user?.id || null,
        JSON.stringify(visualProgram || { nodes: [], edges: [] }),
        JSON.stringify(settings || { autoSave: true, formatOnSave: true, visibility: "private" }),
        progress || 0,
        status || "active",
      ];
      const inserted = await pool.query(insertQuery, insertValues);
      return jsonSuccess({ project: inserted.rows[0] });
    }

    const currentOwner = existing.rows[0].ownerId;
    if (currentOwner && currentOwner !== session?.user?.id) {
      return jsonError("Forbidden: You cannot modify this project", 403);
    }

    const updateQuery = `
      UPDATE "project"
      SET 
        "name" = COALESCE($1, "name"),
        "description" = COALESCE($2, "description"),
        "visualProgram" = COALESCE($3, "visualProgram"),
        "settings" = COALESCE($4, "settings"),
        "progress" = COALESCE($5, "progress"),
        "status" = COALESCE($6, "status"),
        "updatedAt" = NOW(),
        "lastEditedAt" = NOW()
      WHERE "id" = $7
      RETURNING *
    `;

    const values = [
      name || null,
      description !== undefined ? description : null,
      visualProgram ? JSON.stringify(visualProgram) : null,
      settings ? JSON.stringify(settings) : null,
      progress !== undefined ? progress : null,
      status || null,
      projectId,
    ];

    const result = await pool.query(updateQuery, values);

    // Persist file updates
    if (Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        await pool.query(
          `INSERT INTO "project_file" ("id", "projectId", "path", "name", "content", "language", "isMain", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           ON CONFLICT ("id") DO UPDATE SET "content" = EXCLUDED."content", "updatedAt" = NOW()`,
          [
            file.id || `file_${Date.now()}`,
            projectId,
            file.path || "main.py",
            file.name || "main.py",
            file.content || "",
            file.language || "python",
            file.isMain ?? true,
          ]
        );
      }
    }

    // Persist new run if recorded
    if (run) {
      await pool.query(
        `INSERT INTO "project_run" ("id", "projectId", "runNumber", "status", "durationMs", "output", "variables", "error", "timestamp")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          run.id || `run_${Date.now()}`,
          projectId,
          run.runNumber || 1,
          run.status || "success",
          run.durationMs || 0,
          JSON.stringify(run.output || []),
          JSON.stringify(run.variables || {}),
          run.error || null,
        ]
      );
    }

    // Persist activity if recorded
    if (activity) {
      await pool.query(
        `INSERT INTO "project_activity" ("id", "projectId", "type", "description", "timestamp")
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          activity.id || `act_${Date.now()}`,
          projectId,
          activity.type || "saved",
          activity.description || "Updated program",
        ]
      );
    }

    return jsonSuccess({ project: result.rows[0] });
  } catch (error) {
    console.error("Error updating project in database:", error);
    return jsonError("Failed to update project", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const existing = await pool.query(
      `SELECT "ownerId" FROM "project" WHERE "id" = $1 LIMIT 1`,
      [projectId]
    );

    if (existing.rows.length === 0) {
      return jsonError("Project not found", 404);
    }

    const currentOwner = existing.rows[0].ownerId;
    if (currentOwner && currentOwner !== session?.user?.id) {
      return jsonError("Forbidden: You cannot delete this project", 403);
    }

    await pool.query(`DELETE FROM "project" WHERE "id" = $1`, [projectId]);
    return jsonSuccess({ message: "Project deleted successfully", projectId });
  } catch (error) {
    console.error("Error deleting project:", error);
    return jsonError("Failed to delete project", 500);
  }
}
