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

    // Get wallet id (wallet guaranteed to exist now)
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

    const points =
      watchTime >= 15 ? 5 :
      watchTime >= 8  ? 3 : 2;

    const insertRes = await client.query(`
      INSERT INTO wallet_ledger_entries
      (wallet_id, type, source, reference_id, points, balance_after)
      SELECT $1, 'EARN', 'REEL_WATCH', $2, $3,
        COALESCE(
          (SELECT balance_after
           FROM wallet_ledger_entries
           WHERE wallet_id=$1
           ORDER BY created_at DESC
           LIMIT 1),
        0) + $3
      ON CONFLICT (wallet_id, source, reference_id)
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
    SELECT COALESCE(MAX(wle.balance_after), 0) AS balance
    FROM wallet_accounts wa
    LEFT JOIN wallet_ledger_entries wle
      ON wle.wallet_id = wa.id
    WHERE wa.user_id = $1
  `, [userId]);

  const balance = result.rows[0]?.balance || 0;

  await redis.set(cacheKey, balance, "EX", 60);

  return balance;
};


