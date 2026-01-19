import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  const pubClient = new Redis({ host: "127.0.0.1", port: 6379 });
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Join personal room
    socket.join(`user:${userId}`);

    // Presence
    markOnline(userId);

    socket.on("disconnect", () => {
      markOffline(userId);
    });
  });

  return io;
};

import { getUserSocket } from "../realtime/presence.js";
import { markConversationSeenService } from "../services/message.service.js";

socket.on("conversation_seen", async ({ conversationId, otherUserId }) => {
  await markConversationSeenService(conversationId, socket.userId);

  const otherSocket = await getUserSocket(otherUserId);

  if (otherSocket) {
    io.to(otherSocket).emit("messages_seen", {
      conversationId,
      seenBy: socket.userId,
    });
  }
});

