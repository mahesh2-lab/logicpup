import { NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";
import { jsonSuccess, jsonError, validateString } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;
    let query = `SELECT * FROM "project" ORDER BY "updatedAt" DESC`;
    const params: unknown[] = [];

    if (userId) {
      query = `SELECT * FROM "project" WHERE "ownerId" = $1 OR "ownerId" IS NULL ORDER BY "updatedAt" DESC`;
      params.push(userId);
    }

    const result = await pool.query(query, params);
    return jsonSuccess({ projects: result.rows });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return jsonError("Failed to fetch projects", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const body = await request.json();
    const { id, name, description, language, templateId, visualProgram, files, settings, progress, status } = body;

    const projectId = id || `proj_${Date.now()}`;
    const nameVal = validateString(name, "Project name", { min: 1, max: 150 });
    const projectName = nameVal.valid ? nameVal.value : "New Python Project";

    const query = `
      INSERT INTO "project" (
        "id", "name", "description", "language", "templateId", "status", "progress",
        "ownerId", "visualProgram", "settings", "updatedAt", "lastEditedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "description" = EXCLUDED."description",
        "visualProgram" = EXCLUDED."visualProgram",
        "settings" = EXCLUDED."settings",
        "status" = EXCLUDED."status",
        "progress" = EXCLUDED."progress",
        "updatedAt" = NOW(),
        "lastEditedAt" = NOW()
      RETURNING *
    `;

    const values = [
      projectId,
      projectName,
      description || "",
      language || "python",
      templateId || "empty",
      status || "active",
      progress || 0,
      session?.user?.id || null,
      JSON.stringify(visualProgram || { nodes: [], edges: [] }),
      JSON.stringify(settings || { autoSave: true, formatOnSave: true, visibility: "private" }),
    ];

    const result = await pool.query(query, values);
    const createdProject = result.rows[0];

    // Insert starter files if provided
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

    return jsonSuccess({ project: createdProject }, 201);
  } catch (error) {
    console.error("Error creating project in database:", error);
    return jsonError("Failed to create project", 500);
  }
}
