import Follow from "../../models/follow.models.js";
import Reel from "../../models/reel.models.js";
import { decodeCursor, encodeCursor, buildCursorQuery } from "../../utils/cursor.util.js";

export const getHomeFeed = async ({ userId, cursor, limit = 20 }) => {
  const decoded = decodeCursor(cursor);

  // 1️⃣ Get following list
  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const followingIds = following.map((f) => f.following);

  if (followingIds.length === 0) {
    return { items: [], nextCursor: null };
  }

  // 2️⃣ Fetch reels
  const reels = await Reel.find({
    creator: { $in: followingIds },
    isDeleted: false,
    ...buildCursorQuery(decoded),
  })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  // 3️⃣ Pagination
  const hasNext = reels.length > limit;
  const items = hasNext ? reels.slice(0, limit) : reels;

  return {
    items,
    nextCursor: hasNext ? encodeCursor(items[items.length - 1]) : null,
  };
};
