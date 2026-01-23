import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "LIKE_POST",
        "LIKE_COMMENT",
        "COMMENT_POST",
        "FOLLOW",
        "MENTION",
        "REEL_LIKE",
      ],
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Fast notification feed
notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);



/*
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

*/
