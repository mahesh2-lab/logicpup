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
    if (!userId) {
      return jsonSuccess({ completedChallengeIds: [] });
    }

    const result = await pool.query(
      `SELECT "challengeId" FROM "user_challenge" WHERE "userId" = $1 AND "completed" = true`,
      [userId]
    );

    const completedChallengeIds = result.rows.map((r: { challengeId: string }) => r.challengeId);
    return jsonSuccess({ completedChallengeIds });
  } catch (error) {
    console.error("Error fetching completed challenges:", error);
    return jsonError("Failed to fetch challenge progress", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized: Please sign in to record progress", 401);
    }

    const body = await request.json();
    const { challengeId } = body;

    const validation = validateString(challengeId, "Challenge ID", { min: 1 });
    if (!validation.valid) {
      return jsonError(validation.error || "Invalid challenge ID", 400);
    }

    const query = `
      INSERT INTO "user_challenge" ("id", "userId", "challengeId", "completed", "completedAt")
      VALUES ($1, $2, $3, true, NOW())
      ON CONFLICT ("userId", "challengeId")
      DO UPDATE SET "completed" = true, "completedAt" = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [
      `uc_${userId}_${validation.value}`,
      userId,
      validation.value,
    ]);

    return jsonSuccess({ challengeProgress: result.rows[0] });
  } catch (error) {
    console.error("Error completing challenge:", error);
    return jsonError("Failed to record challenge progress", 500);
  }
}
