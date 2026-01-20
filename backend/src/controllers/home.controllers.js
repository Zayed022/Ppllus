import { getFollowingPosts } from "./post.controllers.js";
import { getFollowingReels } from "./reel.controllers.js";
import { getExploreFeed } from "../services/feed/exploreFeed.service.js";

export const homeFeed = async (req, res) => {
  const userId = req.user.sub;
  const { cursor, limit = 20 } = req.query;

  // 1️⃣ Following posts
  const postFeed = await getFollowingPosts({
    userId,
    cursor,
    limit,
  });

  // 2️⃣ Inject reels every ~6 posts
  const reels = await getFollowingReels(userId, 3);

  const mixed = [];
  let reelIndex = 0;

  postFeed.items.forEach((item, index) => {
    mixed.push(item);

    if ((index + 1) % 6 === 0 && reels[reelIndex]) {
      mixed.push(reels[reelIndex++]);
    }
  });

  // 3️⃣ If feed is exhausted → inject explore
  if (mixed.length < limit) {
    const explore = await getExploreFeed({ limit: 10 });
    explore.forEach(r =>
      mixed.push({ type: "REEL", reel: r })
    );
  }

  res.json({
    items: mixed,
    nextCursor: postFeed.nextCursor,
  });
};
