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
    let query = `SELECT * FROM "collection" ORDER BY "updatedAt" DESC`;
    const params: unknown[] = [];

    if (userId) {
      query = `SELECT * FROM "collection" WHERE "ownerId" = $1 OR "ownerId" IS NULL ORDER BY "updatedAt" DESC`;
      params.push(userId);
    }

    const result = await pool.query(query, params);
    const collectionIds = result.rows.map((c: { id: string }) => c.id);

    let memberships: Array<{ projectId: string; collectionId: string }> = [];
    if (collectionIds.length > 0) {
      const memResult = await pool.query(
        `SELECT * FROM "project_collection" WHERE "collectionId" = ANY($1::text[])`,
        [collectionIds]
      );
      memberships = memResult.rows;
    }

    const collectionsWithProjects = result.rows.map((c: {
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

    return jsonSuccess({ collections: collectionsWithProjects });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return jsonError("Failed to fetch collections", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const body = await request.json();
    const { id, name, description, icon, color, action, collectionId, projectId } = body;

    // Handle toggle project in collection action
    if (action === "toggle_project" && collectionId && projectId) {
      const existing = await pool.query(
        `SELECT * FROM "project_collection" WHERE "collectionId" = $1 AND "projectId" = $2`,
        [collectionId, projectId]
      );

      if (existing.rows.length > 0) {
        await pool.query(
          `DELETE FROM "project_collection" WHERE "collectionId" = $1 AND "projectId" = $2`,
          [collectionId, projectId]
        );
        return jsonSuccess({ status: "removed", collectionId, projectId });
      } else {
        await pool.query(
          `INSERT INTO "project_collection" ("collectionId", "projectId", "addedAt") VALUES ($1, $2, NOW())`,
          [collectionId, projectId]
        );
        return jsonSuccess({ status: "added", collectionId, projectId });
      }
    }

    const nameValidation = validateString(name, "Collection name", { min: 1, max: 100 });
    if (!nameValidation.valid) {
      return jsonError(nameValidation.error || "Invalid name", 400);
    }

    const newColId = id || `col_${Date.now()}`;
    const query = `
      INSERT INTO "collection" (
        "id", "name", "description", "icon", "color", "ownerId", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "description" = EXCLUDED."description",
        "icon" = EXCLUDED."icon",
        "color" = EXCLUDED."color",
        "updatedAt" = NOW()
      RETURNING *
    `;

    const values = [
      newColId,
      nameValidation.value,
      description || "",
      icon || "Folder",
      color || "#F26A3D",
      session?.user?.id || null,
    ];

    const result = await pool.query(query, values);
    return jsonSuccess({ collection: { ...result.rows[0], projectIds: [] } }, 201);
  } catch (error) {
    console.error("Error creating collection:", error);
    return jsonError("Failed to create collection", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get("id");

    if (!collectionId) {
      return jsonError("Collection ID is required", 400);
    }

    const existing = await pool.query(
      `SELECT "ownerId" FROM "collection" WHERE "id" = $1 LIMIT 1`,
      [collectionId]
    );

    if (existing.rows.length === 0) {
      return jsonError("Collection not found", 404);
    }

    const currentOwner = existing.rows[0].ownerId;
    if (currentOwner && currentOwner !== session?.user?.id) {
      return jsonError("Forbidden: You cannot delete this collection", 403);
    }

    await pool.query(`DELETE FROM "collection" WHERE "id" = $1`, [collectionId]);
    return jsonSuccess({ message: "Collection deleted successfully", collectionId });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return jsonError("Failed to delete collection", 500);
  }
}
