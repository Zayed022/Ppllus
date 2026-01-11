import TrustScore from "../models/trustScore.models.js";

export const evaluateTrust = async ({ userId, eventType }) => {
  const trust =
    (await TrustScore.findOne({ user: userId })) ||
    (await TrustScore.create({ user: userId }));

  if (eventType === "LIKE") trust.flags.spam += 1;
  if (eventType === "REEL_VIEW") trust.flags.velocity += 1;

  // Penalize if excessive
  if (trust.flags.spam > 50 || trust.flags.velocity > 200) {
    trust.score -= 10;
  }

  // Shadow ban threshold
  if (trust.score < 40) {
    trust.shadowBanned = true;
  }

  await trust.save();
};
