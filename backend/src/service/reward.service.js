import EngagementEvent from "../models/engagementEvent.models.js";
import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();


const DAILY_CAP = 50;

export const processReelViewReward = async ({
  userId,
  reelId,
  watchTime,
}) => {
  if (watchTime < 5) return;

  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `SELECT pg_advisory_xact_lock(hashtext($1))`,
      [walletId]
    );
    

    // 1️⃣ Ensure wallet exists
    const walletRes = await client.query(
      `INSERT INTO wallet_accounts (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING id`,
      [userId]
    );

    const walletId = walletRes.rows[0].id;

    // 2️⃣ Prevent duplicate reward for same reel
    const alreadyRewarded = await client.query(
      `SELECT 1 FROM wallet_ledger_entries
       WHERE wallet_id = $1 AND reference_id = $2`,
      [walletId, reelId]
    );

    if (alreadyRewarded.rowCount > 0) {
      await client.query("ROLLBACK");
      return;
    }

    // 3️⃣ Enforce daily cap
    const dailyEarned = await client.query(
      `SELECT COALESCE(SUM(points), 0) as total
       FROM wallet_ledger_entries
       WHERE wallet_id = $1
       AND type = 'EARN'
       AND created_at >= CURRENT_DATE`,
      [walletId]
    );

    if (Number(dailyEarned.rows[0].total) >= DAILY_CAP) {
      await client.query("ROLLBACK");
      return;
    }

    // 4️⃣ Calculate reward
    const points = watchTime >= 15 ? 5 : 2;

    // 5️⃣ Get last balance
    const lastBalanceRes = await client.query(
      `SELECT balance_after
       FROM wallet_ledger_entries
       WHERE wallet_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [walletId]
    );

    const lastBalance = lastBalanceRes.rows[0]?.balance_after || 0;
    const newBalance = lastBalance + points;

    // 6️⃣ Insert ledger entry
    // 6️⃣ Insert ledger entry
await client.query(
    `INSERT INTO wallet_ledger_entries
     (wallet_id, type, source, reference_id, points, balance_after)
     VALUES ($1, 'EARN', 'REEL_WATCH', $2, $3, $4)`,
    [walletId, reelId, points, newBalance]
  );
  
  // 🔥 POINT 6 — Redis write-through
  await redis.set(
    `wallet:balance:${userId}`,
    newBalance,
    "EX",
    60
  );
  
  await client.query("COMMIT");
  

    
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
