import { Queue } from "bullmq";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

export const eventQueue = new Queue("events", {
  connection: redis,
});
