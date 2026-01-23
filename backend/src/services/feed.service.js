import mongoose from "mongoose";
import Block from "../models/block.models.js";
import Mute from "../models/mute.models.js";
import Reel from "../models/reel.models.js";

export const buildFilteredFeed = async (
  userId,
  { cursor, limit = 50 } = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId passed to buildFilteredFeed");
  }

  const uid = new mongoose.Types.ObjectId(userId);

  // 1. Fetch blocked relations
  const blocks = await Block.find({
    $or: [{ blocker: uid }, { blocked: uid }],
  }).select("blocker blocked");

  // 2. Fetch muted users
  const muted = await Mute.find({ user: uid }).select("mutedUser");

  // 3. Build exclusion set
  const excludedUserIds = new Set([uid.toString()]); // exclude self

  for (const b of blocks) {
    excludedUserIds.add(b.blocker.toString());
    excludedUserIds.add(b.blocked.toString());
  }

  for (const m of muted) {
    excludedUserIds.add(m.mutedUser.toString());
  }

  // 4. Build query
  const query = {
    creator: { $nin: Array.from(excludedUserIds) },
    isDeleted: false,
  };

  if (cursor) {
    query._id = { $lt: cursor }; // cursor pagination
  }

  // 5. Fetch lightweight reel candidates
  return Reel.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .select(
      "_id creator categories createdAt viewsCount likesCount sharesCount"
    )
    .lean();
};
