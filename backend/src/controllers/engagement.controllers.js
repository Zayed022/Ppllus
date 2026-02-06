import EngagementEvent from "../models/engagementEvent.models.js";
import Reel from "../models/reel.models.js";
import ReelLike from "../models/reelLike.models.js";
import Comment from "../models/comment.models.js"
import { processReelViewReward } from "../services/reward.service.js";
import { emitEvent } from "../events/emitEvent.js";
import { isFeatureEnabled } from "../services/featureFlag.service.js";
import { getRedis } from "../db/redis.js";
const redis = getRedis();
import mongoose from "mongoose"


export const recordReelView = async (req, res) => {
  const { reelId } = req.params;
  const { watchTime = 0 } = req.body;
  const userKey = req.user?.sub || req.ip;

  // 1️⃣ Deduplicate views (30 min)
  const dedupeKey = `reel:view:${reelId}:${userKey}`;
  const alreadyViewed = await redis.get(dedupeKey);

  if (alreadyViewed) {
    return res.json({ viewed: false });
  }

  await redis.set(dedupeKey, "1", "EX", 1800);

  // 2️⃣ Increment view count
  const reel = await Reel.findByIdAndUpdate(
    reelId,
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).select("creator createdAt");

  if (!reel) {
    return res.status(404).json({ message: "Reel not found" });
  }

  // 3️⃣ Store engagement
  EngagementEvent.create({
    user: req.user?.sub,
    contentId: reelId,
    contentType: "REEL",
    eventType: "VIEW",
    watchTime,
  }).catch(console.error);

  // 4️⃣ Emit ranking signal
  emitEvent({
    type: "RANK_REEL",
    reelId,
    creatorId: reel.creator,
    watchTime,
    createdAt: reel.createdAt,
  });

  res.json({ viewed: true });
};

export const likeReel = async (req, res) => {
  const userId = req.user.sub;
  const { reelId } = req.params;

  try {
    const engagement = await EngagementEvent.create({
      user: userId,
      contentId: reelId,
      contentType: "REEL",
      eventType: "LIKE",
    });

    const reel = await Reel.findByIdAndUpdate(
      reelId,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    // 🔔 EMIT EVENT
    emitEvent({
      type: "LIKE",
      actorId: userId,
      targetUserId: reel.creator,
      entityId: reelId,
    });

    emitEvent({
      type: "RANK_REEL",
      reelId,
      creatorId: reel.creator,
      watchTime,
      createdAt: reel.createdAt,
    });
    

    res.json({ message: "Liked" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already liked" });
    }
    throw err;
  }
};

export const toggleLikeReel = async (req, res) => {
  const userId = req.user.sub;
  const { reelId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await ReelLike.findOne(
      { reel: reelId, user: userId },
      null,
      { session }
    );

    if (existing) {
      await existing.deleteOne({ session });
      await Reel.findByIdAndUpdate(
        reelId,
        { $inc: { likesCount: -1 } },
        { session }
      );

      await session.commitTransaction();
      return res.json({ liked: false });
    }

    await ReelLike.create([{ reel: reelId, user: userId }], { session });

    const reel = await Reel.findByIdAndUpdate(
      reelId,
      { $inc: { likesCount: 1 } },
      { new: true, session }
    );

    emitEvent({
      type: "LIKE",
      actorId: userId,
      targetUserId: reel.creator,
      entityId: reelId,
    });

    await session.commitTransaction();
    res.json({ liked: true });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Like failed" });
  } finally {
    session.endSession();
  }
};


export const createReelComment = async (req, res) => {
  const { reelId } = req.params;
  const { text, parentComment } = req.body;
  const userId = req.user.sub;

  if (!text?.trim()) {
    return res.status(400).json({ message: "Comment text required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await Comment.create(
      [
        {
          reel: reelId,
          user: userId,
          text,
          parentComment: parentComment || null,
        },
      ],
      { session }
    );

    const reel = await Reel.findByIdAndUpdate(
      reelId,
      { $inc: { commentsCount: 1 } },
      { new: true, session }
    );

    // 🔔 Notify reel owner
    emitEvent({
      type: "COMMENT",
      actorId: userId,
      targetUserId: reel.creator,
      entityId: reelId,
    });

    await session.commitTransaction();
    res.status(201).json(comment[0]);
  } catch (err) {
    await session.abortTransaction();
    console.error("Create reel comment error:", err);
    res.status(500).json({ message: "Failed to comment" });
  } finally {
    session.endSession();
  }
};


export const shareReel = async (req, res) => {
  const userId = req.user.sub;
  const { reelId } = req.params;

  await EngagementEvent.create({
    user: userId,
    contentId: reelId,
    contentType: "REEL",
    eventType: "SHARE",
  });

  const reel = await Reel.findByIdAndUpdate(
    reelId,
    { $inc: { sharesCount: 1 } },
    { new: true }
  );

  // 🔔 EMIT EVENT
  emitEvent({
    type: "SHARE",
    actorId: userId,
    targetUserId: reel.creator,
    entityId: reelId,
  });
  

 
  

  res.json({ message: "Shared" });
};

export const incrementReelView2 = async (req, res) => {
  const { reelId } = req.params;
  const userId = req.user?.sub || req.ip;

  // ⛔ Prevent duplicate views per session
  const key = `reel:view:${reelId}:${userId}`;
  const alreadyViewed = await redis.get(key);

  if (alreadyViewed) {
    return res.json({ viewed: false });
  }

  await redis.set(key, "1", "EX", 60 * 60); // 1 hour dedupe

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { viewsCount: 1 },
  });

  // 🔁 Ranking signal
  emitEvent({
    type: "RANK_REEL",
    reelId,
    watchTime: 3,
  });

  res.json({ viewed: true });
};
    
