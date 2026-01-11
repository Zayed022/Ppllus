import { Worker } from "bullmq";
import DeviceToken from "../models/deviceToken.models.js";
import { sendPush } from "../services/push.service.js";
import { getRedis } from "../db/redis.js";

new Worker(
  "push",
  async (job) => {
    const { userId, type } = job.data;

    const tokens = await DeviceToken.find({ user: userId });

    if (!tokens.length) return;

    await sendPush(tokens, {
      title: "PPLLU",
      body: buildPushMessage(type),
    });
  },
  { connection: getRedis() }
);

const buildPushMessage = (type) => {
  switch (type) {
    case "LIKE":
      return "Someone liked your reel";
    case "FOLLOW":
      return "You have a new follower";
    case "WALLET_EARN":
      return "You earned points!";
    default:
      return "You have a new notification";
  }
};
