import Reel from "../../models/reel.models.js";
import { decodeCursor, encodeCursor, buildCursorQuery } from "../../utils/cursor.util.js";

export const getCategoryFeed = async ({ category, cursor, limit = 20 }) => {
  const decoded = decodeCursor(cursor);

  const reels = await Reel.find({
    categories: category,
    isDeleted: false,
    ...buildCursorQuery(decoded),
  })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasNext = reels.length > limit;
  const items = hasNext ? reels.slice(0, limit) : reels;

  return {
    items,
    nextCursor: hasNext ? encodeCursor(items[items.length - 1]) : null,
  };
};
