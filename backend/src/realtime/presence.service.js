import { getRedis } from "../db/redis.js";
const redis = getRedis();

const PRESENCE_TTL = 60;

/**
 * Mark user online + store socket
 */
export const markOnline = async (userId, socketId) => {
  await redis.multi()
    .set(`presence:${userId}`, "online", "EX", PRESENCE_TTL)
    .set(`socket:${userId}`, socketId, "EX", PRESENCE_TTL)
    .exec();
};

/**
 * Refresh TTL (heartbeat)
 */
export const refreshPresence = async (userId) => {
  await redis.expire(`presence:${userId}`, PRESENCE_TTL);
  await redis.expire(`socket:${userId}`, PRESENCE_TTL);
};

/**
 * Mark user offline
 */
export const markOffline = async (userId) => {
  await redis.del(`presence:${userId}`, `socket:${userId}`);
};

/**
 * Check if user is online
 */
export const isOnline = async (userId) => {
  return (await redis.get(`presence:${userId}`)) === "online";
};

/**
 * Get socketId of user (for routing events)
 */
export const getUserSocket = async (userId) => {
  return redis.get(`socket:${userId}`);
};
