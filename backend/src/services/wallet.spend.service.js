import { pgPool } from "../db/postgres.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

import { io } from "../realtime/io.instance.js";

export const redeemOffer = async ({
  userId,
  offerId,
  shopId,
  pointsRequired,
}) => {
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch wallet (lock row)
    const walletRes = await client.query(
      `SELECT id FROM wallet_accounts
       WHERE user_id = $1
       FOR UPDATE`,
      [userId]
    );

    if (walletRes.rowCount === 0) {
      throw new Error("Wallet not found");
    }

    const walletId = walletRes.rows[0].id;

    // 2️⃣ Prevent duplicate redemption
    const duplicate = await client.query(
      `SELECT 1 FROM offer_redemptions
       WHERE user_id = $1 AND offer_id = $2`,
      [userId, offerId]
    );

    if (duplicate.rowCount > 0) {
      throw new Error("Offer already redeemed");
    }

    // 3️⃣ Get latest balance
    const balanceRes = await client.query(
      `SELECT balance_after
       FROM wallet_ledger_entries
       WHERE wallet_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [walletId]
    );

    const currentBalance = balanceRes.rows[0]?.balance_after || 0;

    if (currentBalance < pointsRequired) {
      throw new Error("Insufficient points");
    }

    const newBalance = currentBalance - pointsRequired;

    // 4️⃣ Insert SPEND ledger entry
    await client.query(
      `INSERT INTO wallet_ledger_entries
       (wallet_id, type, source, reference_id, points, balance_after)
       VALUES ($1, 'SPEND', 'OFFER_REDEEM', $2, $3, $4)`,
      [walletId, offerId, pointsRequired, newBalance]
    );

    // 5️⃣ Insert redemption record
    await client.query(
      `INSERT INTO offer_redemptions
       (user_id, offer_id, shop_id, points_used, status)
       VALUES ($1, $2, $3, $4, 'CONFIRMED')`,
      [userId, offerId, shopId, pointsRequired]
    );

    await client.query("COMMIT");

    // 6️⃣ Update Redis balance cache
    await redis.set(
      `wallet:balance:${userId}`,
      newBalance,
      "EX",
      60
    );
    io.to(`user:${userId}`).emit("wallet:update", {
        balance: newBalance,
      });

    return { balance: newBalance };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
