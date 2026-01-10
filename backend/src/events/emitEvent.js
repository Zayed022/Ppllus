import { eventQueue } from "../queues/event.queue.js";

export const emitEvent = async (event) => {
  await eventQueue.add(event.type, event, {
    attempts: 5,
    backoff: { type: "exponential", delay: 500 },
    removeOnComplete: true,
    removeOnFail: false,
  });
};
