import Reel from "../models/reel.models.js";
import Follow from "../models/follow.models.js";
import Comment from "../models/comment.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createReel = async (req, res) => {
  const {duration, categories, city } = req.body;

  const videoUrlLocalPath = req.files?.videoUrl[0]?.path;
    console.log(videoUrlLocalPath);
    if (!videoUrlLocalPath) {
      return res.status(400).json({ message: "Video file is required" });
    }
    const video = await uploadOnCloudinary(videoUrlLocalPath);
    if (!video) {
      return res.status(400).json({ message: "Video file is required" });
    } 

    const thumbnailUrlLocalPath = req.files?.thumbnailUrl[0]?.path;
    console.log(thumbnailUrlLocalPath);
    if (!thumbnailUrlLocalPath) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }
    const thumbnail = await uploadOnCloudinary(thumbnailUrlLocalPath);
    if (!thumbnail) {
      return res.status(400).json({ message: "Thumbnail file is required" });
    } 

  const reel = await Reel.create({
    creator: req.user.sub,
    videoUrl: video.url,
    thumbnailUrl: thumbnail.url,
    duration,
    categories,
    city,
  });

  res.status(201).json(reel);
};

import { getRedis } from "../db/redis.js";
import mongoose from "mongoose";

const redis = getRedis();


export const getReelFeed = async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const cacheKey = `reels:feed:${req.user.sub}:${cursor || "first"}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // existing MongoDB feed logic here
  const reels = await buildFeed(req);

  await redis.set(
    cacheKey,
    JSON.stringify(reels),
    "EX",
    30
  );

  res.json(reels);
};

export const getReelStats = async (reelId) => {
    const key = `reel:stats:${reelId}`;
  
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  
    const reel = await Reel.findById(reelId).select(
      "viewsCount likesCount sharesCount"
    );
  
    await redis.set(
      key,
      JSON.stringify(reel),
      "EX",
      60
    );
  
    return reel;
};

export const getFollowingReels = async (userId, limit = 3) => {
  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const creatorIds = following.map(f => f.following);

  const reels = await Reel.find({
    creator: { $in: creatorIds },
    "moderation.status": "ACTIVE",
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("creator", "username profileImage");

  return reels.map(reel => ({
    type: "REEL",
    reel,
  }));
};

export const getMyReels = async (req, res) => {
  const userId = req.user.sub;
  const { cursor, limit = 20 } = req.query;

  const query = {
    creator: userId,
    isDeleted: false,
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const reels = await Reel.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .select(
      "videoUrl thumbnailUrl duration categories city viewsCount likesCount sharesCount moderation createdAt"
    )
    .lean();

  res.json(reels);
};

export const getUserReels = async (req, res) => {
  const { userId } = req.params;
  const { cursor, limit = 20 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  const query = {
    creator: userId,
    isDeleted: false,
    "moderation.status": "ACTIVE",
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const reels = await Reel.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .select(
      "videoUrl thumbnailUrl duration categories city viewsCount likesCount sharesCount createdAt"
    )
    .lean();

  res.json(reels);
};

export const getReelById = async (req, res) => {
  const { reelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reelId)) {
    return res.status(400).json({ message: "Invalid reelId" });
  }

  const reel = await Reel.findOne({
    _id: reelId,
    isDeleted: false,
    "moderation.status": "ACTIVE",
  })
    .populate("creator", "username profileImage")
    .lean();

  if (!reel) {
    return res.status(404).json({ message: "Reel not found" });
  }

  res.json(reel);
};

export const incrementReelView = async (req, res) => {
  const { reelId } = req.params;

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { viewsCount: 1 },
  });

  res.json({ success: true });
};

export const deleteReel = async (req, res) => {
  const { reelId } = req.params;
  const userId = req.user.sub;

  const reel = await Reel.findOne({
    _id: reelId,
    creator: userId,
    isDeleted: false,
  });

  if (!reel) {
    return res.status(404).json({ message: "Reel not found" });
  }

  reel.isDeleted = true;
  await reel.save();

  res.json({ success: true });
};

export const shadowBanReel = async (reelId, reason) => {
  await Reel.findByIdAndUpdate(reelId, {
    "moderation.status": "SHADOW_BANNED",
    "moderation.reason": reason,
    "moderation.reviewedAt": new Date(),
  });
};

export const getReelComments = async (req, res) => {
  const { reelId } = req.params;
  const { cursor, limit = 20 } = req.query;

  const query = {
    reel: reelId,
    parentComment: null,
    isDeleted: false,
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const comments = await Comment.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .populate("user", "username profileImage")
    .lean();

  res.json(comments);
};







  



