import { Worker } from "bullmq";
import Notification from "../models/notification.models.js";
import { io } from "../realtime/io.instance.js";
import { redis } from "../db/redis.js";

const buildMessage = (event) => {
  switch (event.type) {
    case "LIKE_POST":
      return "liked your post";
    case "COMMENT_POST":
      return "commented on your post";
    case "FOLLOW":
      return "started following you";
    case "LIKE_COMMENT":
      return "liked your comment";
    default:
      return "You have a new notification";
  }
};

export const notificationWorker = new Worker(
  "events",
  async (job) => {
    const event = job.data;

    // 🚫 No self notifications
    if (event.actorId === event.targetUserId) return;

    const notification = await Notification.create({
      user: event.targetUserId,
      actor: event.actorId,
      type: event.type,
      entityId: event.entityId,
      message: buildMessage(event),
    });

    // 🔴 Realtime socket push
    io.to(`user:${event.targetUserId}`).emit("notification:new", {
      id: notification._id,
      type: notification.type,
      message: notification.message,
      createdAt: notification.createdAt,
    });
  },
  { connection: redis }
);
