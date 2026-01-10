import { getRedis } from "../db/redis.js";
const redis = getRedis();


export const markOnline = async (userId) => {
  await redis.set(`presence:${userId}`, "online", "EX", 60);
};

export const markOffline = async (userId) => {
  await redis.del(`presence:${userId}`);
};

export const isOnline = async (userId) => {
  return (await redis.get(`presence:${userId}`)) === "online";
};
