import { evaluateTrust } from "../services/abuseDetection.service.js";

export const processAbuseEvent = async (event) => {
  await evaluateTrust({
    userId: event.actorId,
    eventType: event.type,
  });
};
