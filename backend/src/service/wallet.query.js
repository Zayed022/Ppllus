import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();


export const getWalletBalance = async (userId) => {
  const cacheKey = `wallet:balance:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return Number(cached);

  const res = await pgPool.query(
    `SELECT balance_after
     FROM wallet_ledger_entries
     WHERE wallet_id = (
       SELECT id FROM wallet_accounts WHERE user_id = $1
     )
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  const balance = res.rows[0]?.balance_after || 0;

  await redis.set(cacheKey, balance, "EX", 60);
  return balance;
};
