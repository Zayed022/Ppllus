import CreatorAnalytics from "../models/creatorAnalytics.models.js";

export const processAnalyticsEvent = async (event) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const update = {};

  if (event.type === "REEL_VIEW") {
    update.$inc = {
      "reels.views": 1,
      "reels.watchTime": event.watchTime || 0,
    };
  }

  if (event.type === "LIKE") {
    update.$inc = { "reels.likes": 1 };
  }

  if (event.type === "SHARE") {
    update.$inc = { "reels.shares": 1 };
  }

  if (!update.$inc) return;

  await CreatorAnalytics.updateOne(
    { creator: event.targetUserId, date: today },
    update,
    { upsert: true }
  );
};
