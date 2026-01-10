import Notification from "../models/notification.models.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();

import { io } from "../realtime/io.instance.js";

redis.subscribe("events");

redis.on("message", async (_, message) => {
  const event = JSON.parse(message);

  const notification = {
    user: event.targetUserId,
    actor: event.actorId,
    type: event.type,
    entityId: event.entityId,
    message: buildMessage(event),
  };

  await Notification.create(notification);
  io.to(`user:${event.targetUserId}`).emit("notification", {
    type: event.type,
    message: notification.message,
  });
});

const buildMessage = (event) => {
  switch (event.type) {
    case "LIKE":
      return "liked your reel";
    case "FOLLOW":
      return "started following you";
    case "OFFER_REDEEM":
      return "offer redeemed successfully";
    default:
      return "You have a new notification";
  }
};
