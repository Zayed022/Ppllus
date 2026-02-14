import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();


const DAILY_CAP = 50;

export const processReelViewReward = async ({
  userId,
  reelId,
  watchTime,
}) => {
  // ❌ Ignore low-quality views
  if (watchTime < 5) return;

  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Ensure wallet exists (idempotent)
    const walletRes = await client.query(
      `INSERT INTO wallet_accounts (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
       RETURNING id`,
      [userId]
    );

    const walletId = walletRes.rows[0].id;

    // 2️⃣ Prevent duplicate reward per reel
    const duplicate = await client.query(
      `SELECT 1 FROM wallet_ledger_entries
       WHERE wallet_id = $1 AND reference_id = $2`,
      [walletId, reelId]
    );

    if (duplicate.rowCount > 0) {
      await client.query("ROLLBACK");
      return;
    }

    // 3️⃣ Enforce daily cap (CRITICAL)
    const dailyEarned = await client.query(
      `SELECT COALESCE(SUM(points), 0) AS total
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

    // 4️⃣ Reward calculation (policy layer)
    const points =
      watchTime >= 15 ? 5 :
      watchTime >= 8  ? 3 : 2;

    // 5️⃣ Read last balance
    const balanceRes = await client.query(
      `SELECT balance_after
       FROM wallet_ledger_entries
       WHERE wallet_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [walletId]
    );

    const lastBalance = balanceRes.rows[0]?.balance_after || 0;
    const newBalance = lastBalance + points;

    // 6️⃣ Insert immutable ledger entry
    await client.query(
      `INSERT INTO wallet_ledger_entries
       (wallet_id, type, source, reference_id, points, balance_after)
       VALUES ($1, 'EARN', 'REEL_WATCH', $2, $3, $4)
       ON CONFLICT (wallet_id, source, reference_id)
       DO NOTHING`,
      [walletId, reelId, points, newBalance]
    );
    

    await client.query("COMMIT");

    // 7️⃣ Redis write-through cache
    await redis.set(
      `wallet:balance:${userId}`,
      newBalance,
      "EX",
      60
    );
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
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
    SELECT COALESCE(balance_after, 0) AS balance
    FROM wallet_ledger_entries
    WHERE wallet_id = (
      SELECT id FROM wallet_accounts WHERE user_id = $1
    )
    ORDER BY created_at DESC
    LIMIT 1
  `, [userId]);

  const balance = result.rows[0]?.balance || 0;

  await redis.set(cacheKey, balance, "EX", 60);

  return balance;
};

