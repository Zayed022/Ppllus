import Block from "../models/block.models.js";
import Mute from "../models/mute.models.js";
import Reel from "../models/reel.models.js";

export const buildFilteredFeed = async (userId) => {
  const blocks = await Block.find({
    $or: [
      { blocker: userId },
      { blocked: userId },
    ],
  }).select("blocker blocked");

  const muted = await Mute.find({ user: userId }).select("mutedUser");

  const excludedUserIds = new Set();

  blocks.forEach(b => {
    excludedUserIds.add(b.blocker.toString());
    excludedUserIds.add(b.blocked.toString());
  });

  muted.forEach(m => excludedUserIds.add(m.mutedUser.toString()));

  return Reel.find({
    creator: { $nin: Array.from(excludedUserIds) },
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};
