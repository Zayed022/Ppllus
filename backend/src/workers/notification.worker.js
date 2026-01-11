import { Worker } from "bullmq";
import Notification from "../models/notification.models.js";
import { redis } from "../db/redis.js";
import { io } from "../realtime/io.instance.js";

const buildMessage = (event) => {
  switch (event.type) {
    case "LIKE":
      return "liked your reel";
    case "FOLLOW":
      return "started following you";
    case "COMMENT":
      return "commented on your post";
    case "OFFER_REDEEM":
      return "redeemed an offer";
    case "WALLET_EARN":
      return "earned points";
    default:
      return "You have a new notification";
  }
};

export const notificationWorker = new Worker(
  "events",
  async (job) => {
    const event = job.data;

    // 🚫 Self notifications
    if (event.actorId === event.targetUserId) return;

    const notification = await Notification.create({
      user: event.targetUserId,
      actor: event.actorId,
      type: event.type,
      entityId: event.entityId,
      message: buildMessage(event),
    });

    // 🔴 Realtime push
    io.to(`user:${event.targetUserId}`).emit("notification", {
      id: notification._id,
      type: notification.type,
      message: notification.message,
    });
  },
  { connection: redis }
);

import { pushQueue } from "../queues/push.queue.js";

await pushQueue.add(
  "SEND_PUSH",
  {
    userId: event.targetUserId,
    type: event.type,
    entityId: event.entityId,
  },
  {
    removeOnComplete: true,
    attempts: 3,
  }
);
