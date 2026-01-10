import Reel from "../models/reel.models.js";
import Follow from "../models/follow.models.js";

export const getFeedCandidates = async (userId, limit = 200) => {
  // 1️⃣ Following creators
  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const followingIds = following.map(f => f.following);

  const followingReels = await Reel.find({
    creator: { $in: followingIds },
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(80);

  // 2️⃣ Trending reels
  const trending = await Reel.find({ isDeleted: false })
    .sort({ viewsCount: -1 })
    .limit(60);

  // 3️⃣ Fresh reels
  const fresh = await Reel.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(60);

  // 4️⃣ Merge & dedupe
  const map = new Map();
  [...followingReels, ...trending, ...fresh].forEach(r => {
    map.set(r._id.toString(), r);
  });

  return Array.from(map.values()).slice(0, limit);
};
