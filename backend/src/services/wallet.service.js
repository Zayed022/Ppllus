import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();


const DAILY_CAP = 50;
const MAX_REWARDABLE_SECONDS = 30;

export const processReelViewReward = async ({
  userId,
  reelId,
  watchTime,
}) => {
  if (watchTime < 5) return;

  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    const walletRes = await client.query(
      `SELECT id FROM wallet_accounts WHERE user_id = $1`,
      [userId]
    );

    if (!walletRes.rowCount) {
      await client.query("ROLLBACK");
      return;
    }

    const walletId = walletRes.rows[0].id;

    await client.query(
      `SELECT pg_advisory_xact_lock($1)`,
      [walletId]
    );

    // ✅ Clamp max seconds per reel
    const effectiveWatch = Math.min(
      watchTime,
      MAX_REWARDABLE_SECONDS
    );

    const points =
      effectiveWatch >= 20 ? 5 :
      effectiveWatch >= 10 ? 3 :
      2;

    // ✅ Check daily cap BEFORE insert
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

    const insertRes = await client.query(`
      INSERT INTO wallet_ledger_entries
      (wallet_id, type, source, reference_id, points, reward_date, balance_after)
      SELECT $1, 'EARN', 'REEL_WATCH', $2, $3, CURRENT_DATE,
        COALESCE(
          (SELECT balance_after
           FROM wallet_ledger_entries
           WHERE wallet_id=$1
           ORDER BY created_at DESC
           LIMIT 1),
        0) + $3
      ON CONFLICT (wallet_id, source, reference_id, reward_date)
      DO NOTHING
      RETURNING balance_after
    `, [walletId, reelId, points]);

    if (!insertRes.rowCount) {
      await client.query("ROLLBACK");
      return;
    }

    const newBalance = insertRes.rows[0].balance_after;

    await client.query("COMMIT");

    await redis.set(
      `wallet:balance:${userId}`,
      newBalance,
      "EX",
      60
    );

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
};




export const getWalletBalance = async (userId) => {
  const cacheKey = `wallet:balance:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return Number(cached);

  const res = await pgPool.query(`
    SELECT balance_after
    FROM wallet_ledger_entries
    WHERE wallet_id = (
      SELECT id FROM wallet_accounts WHERE user_id = $1
    )
    ORDER BY created_at DESC
    LIMIT 1
  `, [userId]);

  const balance = res.rows[0]?.balance_after || 0;

  await redis.set(cacheKey, balance, "EX", 60);
  return balance;
};


export const getWalletBalanceByUserId = async (userId) => {
  const cacheKey = `wallet:balance:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached !== null) return Number(cached);

  const result = await pgPool.query(`
    SELECT wle.balance_after
    FROM wallet_accounts wa
    LEFT JOIN wallet_ledger_entries wle
      ON wle.wallet_id = wa.id
    WHERE wa.user_id = $1
    ORDER BY wle.created_at DESC
    LIMIT 1
  `, [userId]);

  const balance = result.rows[0]?.balance_after || 0;

  await redis.set(cacheKey, balance, "EX", 60);

  return balance;
};



