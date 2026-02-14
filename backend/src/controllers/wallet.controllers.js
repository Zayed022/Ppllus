import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
import { getWalletBalanceByUserId } from "../services/wallet.service.js";
const redis = getRedis();


export const getWalletBalance = async (req, res) => {
  const userId = req.user.sub;
  const cacheKey = `wallet:balance:${userId}`;

  // 1️⃣ Redis first
  const cached = await redis.get(cacheKey);
  if (cached !== null) {
    return res.json({ balance: Number(cached) });
  }

  // 2️⃣ PostgreSQL fallback
  const result = await pgPool.query(
    `SELECT COALESCE(balance_after, 0) AS balance
     FROM wallet_ledger_entries
     WHERE wallet_id = (
       SELECT id FROM wallet_accounts WHERE user_id = $1
     )
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  const balance = result.rows[0]?.balance || 0;

  // 3️⃣ Cache it
  await redis.set(cacheKey, balance, "EX", 60);

  res.json({ balance });
};

export const getWalletLedger = async (req, res) => {
    const userId = req.user.sub;
    const { limit = 20, cursor } = req.query;
  
    const query = `
      SELECT *
      FROM wallet_ledger_entries
      WHERE wallet_id = (
        SELECT id FROM wallet_accounts WHERE user_id = $1
      )
      ${cursor ? "AND created_at < $2" : ""}
      ORDER BY created_at DESC
      LIMIT $3
    `;
  
    const params = cursor
      ? [userId, cursor, limit]
      : [userId, limit];
  
    const result = await pgPool.query(query, params);
  
    res.json(result.rows);
};
  
export const getWalletBalanceController = async (req, res) => {
  const balance = await getWalletBalanceByUserId(req.user.sub);
  res.json({ balance });
};



  