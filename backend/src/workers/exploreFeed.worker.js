import Reel from "../models/reel.models.js";
import Post from "../models/post.models.js"
import { getRedis } from "../db/redis.js";

const redis = getRedis();

export const buildExploreFeed = async () => {
  const reels = await Reel.find({
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .select("_id createdAt viewsCount likesCount sharesCount")
    .lean();

  if (!reels.length) return;

  await redis.del("feed:explore:hot", "feed:explore:fresh");

  const hotPipeline = redis.multi();
  const freshPipeline = redis.multi();

  for (const reel of reels) {
    const ageHours =
      (Date.now() - new Date(reel.createdAt).getTime()) / 36e5;

    // 🔥 Hot score (engagement-heavy)
    const hotScore =
      reel.viewsCount * 1 +
      reel.likesCount * 4 +
      reel.sharesCount * 6 -
      ageHours * 0.8;

    // 🆕 Fresh score (newness-heavy)
    const freshScore = -ageHours;

    hotPipeline.zadd(
      "feed:explore:hot",
      hotScore,
      reel._id.toString()
    );

    freshPipeline.zadd(
      "feed:explore:fresh",
      freshScore,
      reel._id.toString()
    );
  }

  await hotPipeline.exec();
  await freshPipeline.exec();

  await redis.expire("feed:explore:hot", 60 * 60);
  await redis.expire("feed:explore:fresh", 60 * 60);

  console.log(`✅ Explore feeds built: ${reels.length}`);
};

export const buildExplorePostsFeed = async () => {
  const posts = await Post.find({
    isDeleted: false,
    $or: [
      { visibility: "PUBLIC" },
      { visibility: { $exists: false } }, // 🔥 IMPORTANT
    ],
  })
  .select("_id createdAt likesCount commentsCount")
  .lean();
  

  if (!posts.length) {
    console.log("⚠️ No posts found for explore");
    return;
  }

  await redis.del(
    "feed:explore:posts:hot",
    "feed:explore:posts:fresh"
  );

  const hotPipeline = redis.multi();
  const freshPipeline = redis.multi();

  for (const post of posts) {
    const ageHours =
      (Date.now() - new Date(post.createdAt).getTime()) / 36e5;

    const hotScore =
      post.likesCount * 5 +
      post.commentsCount * 8 -
      ageHours * 0.6;

    const freshScore = -ageHours;

    hotPipeline.zadd(
      "feed:explore:posts:hot",
      hotScore,
      post._id.toString()
    );

    freshPipeline.zadd(
      "feed:explore:posts:fresh",
      freshScore,
      post._id.toString()
    );
  }

  await hotPipeline.exec();
  await freshPipeline.exec();

  await redis.expire("feed:explore:posts:hot", 3600);
  await redis.expire("feed:explore:posts:fresh", 3600);

  console.log(`✅ Explore posts feed built (${posts.length})`);
};
