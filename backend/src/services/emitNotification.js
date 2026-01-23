import { eventQueue } from "../queues/events.queue.js";

export const emitNotification = async ({
  type,
  actorId,
  targetUserId,
  entityId,
}) => {
  if (!actorId || !targetUserId) return;

  await eventQueue.add(
    "EVENT",
    {
      type,
      actorId,
      targetUserId,
      entityId,
    },
    {
      removeOnComplete: true,
      attempts: 3,
    }
  );
};
