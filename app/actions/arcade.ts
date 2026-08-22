"use server";

import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CODING_LEVELS } from "@/components/visual-editor/learning/levelsData";

export async function getArcadeState() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT ep, "unlockedGames" FROM "user_arcade" WHERE "userId" = $1`,
      [session.user.id]
    );

    if (result.rows.length === 0) {
      // Create initial state for new user
      const defaultGames = JSON.stringify({ racing: true });
      await client.query(
        `INSERT INTO "user_arcade" ("userId", "ep", "unlockedGames") VALUES ($1, $2, $3)`,
        [session.user.id, 0, defaultGames]
      );
      return { ep: 0, unlockedGames: { racing: true } };
    }

    return {
      ep: result.rows[0].ep,
      unlockedGames: result.rows[0].unlockedGames,
    };
  } finally {
    client.release();
  }
}

export async function addEP(amount: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (typeof amount !== 'number' || amount <= 0 || amount > 100) {
    throw new Error("Invalid amount");
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE "user_arcade" SET ep = ep + $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $2 RETURNING ep`,
      [amount, session.user.id]
    );
    if (result.rows.length === 0) {
        throw new Error("User arcade state not found");
    }
    return result.rows[0].ep;
  } finally {
    client.release();
  }
}

export async function unlockGame(gameId: string, cost: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Check current EP and unlocked games
    const stateResult = await client.query(
      `SELECT ep, "unlockedGames" FROM "user_arcade" WHERE "userId" = $1 FOR UPDATE`,
      [session.user.id]
    );
    
    if (stateResult.rows.length === 0) {
      throw new Error("User arcade state not found");
    }
    
    const ep = stateResult.rows[0].ep;
    const unlockedGames = stateResult.rows[0].unlockedGames;
    
    if (unlockedGames[gameId]) {
      await client.query("ROLLBACK");
      return { success: true, ep }; // Already unlocked
    }

    // Calculate real challenge XP securely from DB
    const challengeRes = await client.query(
      `SELECT "challengeId" FROM "user_challenge" WHERE "userId" = $1 AND "completed" = true`,
      [session.user.id]
    );
    const completedIds = challengeRes.rows.map(r => r.challengeId);
    
    let challengeXP = 0;
    for (const level of CODING_LEVELS) {
      for (const ch of level.challenges) {
        if (completedIds.includes(ch.id)) {
          challengeXP += ch.points || 5;
        }
      }
    }
    
    if (ep + challengeXP < cost) {
      await client.query("ROLLBACK");
      return { success: false, error: "Not enough XP", ep };
    }
    
    unlockedGames[gameId] = true;
    
    const updateResult = await client.query(
      `UPDATE "user_arcade" SET ep = ep - $1, "unlockedGames" = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $3 RETURNING ep`,
      [cost, JSON.stringify(unlockedGames), session.user.id]
    );
    
    await client.query("COMMIT");
    return { success: true, ep: updateResult.rows[0].ep, unlockedGames };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
