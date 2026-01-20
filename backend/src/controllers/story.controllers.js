import Story from "../models/story.models.js";
import Follow from "../models/follow.models.js";
import StoryView from "../models/storyView.models.js"
import StoryHighlight from "../models/storyHighlight.models.js";
import StoryReaction from "../models/storyReaction.models.js"
import User from "../models/users.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Redis from "ioredis";
import mongoose from "mongoose";
export const redis = new Redis();

export const createStory = async (req, res) => {
  try {
    const { mediaType, duration, city, visibility } = req.body;

    if (!["IMAGE", "VIDEO"].includes(mediaType)) {
      return res.status(400).json({ message: "Invalid media type" });
    }
    if (!["PUBLIC", "CLOSE_FRIENDS"].includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility" });
    }

    if (mediaType === "VIDEO" && !duration) {
      return res.status(400).json({ message: "Duration required for video" });
    }

    const mediaLocalPath = req.files?.mediaUrl?.[0]?.path;
    if (!mediaLocalPath) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const media = await uploadOnCloudinary(mediaLocalPath);
    if (!media?.url) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      user: req.user.sub,
      mediaUrl: media.url,
      mediaType,
      duration,
      city,
      visibility,
      expiresAt,
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: "Story creation failed" });
  }
};

export const viewStory = async (req, res) => {
  const userId = req.user.sub;
  const { storyId } = req.params;

  try {
    const story = await Story.findById(storyId).select("user expiresAt");
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Expired
    if (story.expiresAt < new Date()) {
      return res.status(410).json({ message: "Story expired" });
    }

    // Self view not allowed
    if (story.user.toString() === userId) {
      return res.json({ status: "OWN_STORY" });
    }

    // Must follow story owner
    const isFollowing = await Follow.exists({
      follower: userId,
      following: story.user,
      status: "ACTIVE",
    });

    if (!isFollowing) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await StoryView.create({
      story: storyId,
      viewer: userId,
    });
    
    // Redis batching
    await redis.sadd(`story:${storyId}:views`, userId);
    

   
  } catch (err) {
    if (err.code !== 11000) {
      console.error(err);
    }
  }

  res.json({ status: "VIEW_RECORDED" });
};

export const getStoryFeed = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.sub);
    const now = new Date();

    const user = await User.findById(userId).select("mutedStories username profileImage");

    /**
     * ============================
     * 1️⃣ SELF STORIES (ALWAYS)
     * ============================
     */
    const selfStories = await Story.find({
      user: userId,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: 1 })
      .select("_id mediaUrl mediaType duration createdAt");

    const selfGroup = {
      user: userId.toString(),
      username: user.username,
      profileImage: user.profileImage,
      stories: selfStories.map(s => ({
        _id: s._id,
        mediaUrl: s.mediaUrl,
        mediaType: s.mediaType,
        duration: s.duration,
        createdAt: s.createdAt,
        seen: true, // self stories are always seen
      })),
      hasUnseen: false,
      isSelf: true,
    };

    /**
     * ============================
     * 2️⃣ FOLLOWED USERS STORIES
     * ============================
     */
    const feed = await Story.aggregate([
      { $match: { expiresAt: { $gt: now } } },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },

      {
        $match: {
          "owner._id": { $nin: user.mutedStories || [] },
        },
      },

      {
        $lookup: {
          from: "follows",
          let: { storyUser: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$following", "$$storyUser"] },
                    { $eq: ["$follower", userId] },
                    { $eq: ["$status", "ACTIVE"] },
                  ],
                },
              },
            },
          ],
          as: "followRelation",
        },
      },

      {
        $match: {
          $expr: {
            $or: [
              {
                $and: [
                  { $eq: ["$visibility", "PUBLIC"] },
                  { $gt: [{ $size: "$followRelation" }, 0] },
                ],
              },
              {
                $and: [
                  { $eq: ["$visibility", "CLOSE_FRIENDS"] },
                  { $in: [userId, "$owner.closeFriends"] },
                ],
              },
            ],
          },
        },
      },

      {
        $lookup: {
          from: "storyviews",
          let: { storyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$story", "$$storyId"] },
                    { $eq: ["$viewer", userId] },
                  ],
                },
              },
            },
          ],
          as: "viewed",
        },
      },

      {
        $addFields: {
          seen: { $gt: [{ $size: "$viewed" }, 0] },
        },
      },

      {
        $group: {
          _id: "$user",
          username: { $first: "$owner.username" },
          profileImage: { $first: "$owner.profileImage" },
          stories: {
            $push: {
              _id: "$_id",
              mediaUrl: "$mediaUrl",
              mediaType: "$mediaType",
              duration: "$duration",
              createdAt: "$createdAt",
              seen: "$seen",
            },
          },
          latestStoryAt: { $max: "$createdAt" },
          hasUnseen: {
            $max: {
              $cond: [{ $eq: ["$seen", false] }, 1, 0],
            },
          },
        },
      },

      { $sort: { hasUnseen: -1, latestStoryAt: -1 } },

      {
        $project: {
          _id: 0,
          user: "$_id",
          username: 1,
          profileImage: 1,
          stories: 1,
          hasUnseen: { $toBool: "$hasUnseen" },
          isSelf: { $literal: false },
        },
      },
    ]);

    /**
     * ============================
     * 3️⃣ REMOVE SELF IF PRESENT
     * ============================
     */
    const filteredFeed = feed.filter(
      g => g.user.toString() !== userId.toString()
    );

    /**
     * ============================
     * 4️⃣ FINAL RESPONSE
     * ============================
     */
    res.status(200).json([selfGroup, ...filteredFeed]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load story feed" });
  }
};

export const getMyActiveStories = async (req, res) => {
  try {
    const userId = req.user.sub;
    const now = new Date();

    const stories = await Story.find({
      user: userId,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: 1 }) // oldest → newest (story playback order)
      .select(
        "_id mediaUrl mediaType duration viewsCount createdAt expiresAt"
      );

    res.status(200).json({
      user: userId,
      stories,
      hasStories: stories.length > 0,
    });
  } catch (err) {
    console.error("Get my active stories error:", err);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

export const getUserStories = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const stories = await Story.find({
      user: userId,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: 1 })
      .select("_id mediaUrl mediaType duration createdAt");

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load stories" });
  }
};

export const getStoryViewers = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.sub;

  const story = await Story.findById(storyId).select("user");
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.user.toString() !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const viewers = await StoryView
    .find({ story: storyId })
    .populate("viewer", "username profileImage")
    .sort({ createdAt: -1 });

  res.json({
    viewsCount: viewers.length, // ✅ FIX
    viewers: viewers.map(v => v.viewer),
  });
};


export const deleteStory = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.sub;

  const story = await Story.findById(storyId);
  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.user.toString() !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await Story.deleteOne({ _id: storyId });
  await StoryView.deleteMany({ story: storyId });

  res.json({ status: "STORY_DELETED" });
};

export const muteStoryUser = async (req, res) => {
  await User.findByIdAndUpdate(req.user.sub, {
    $addToSet: { mutedStories: req.params.userId },
  });

  res.json({ status: "MUTED" });
};

export const unmuteStoryUser = async (req, res) => {
  await User.findByIdAndUpdate(req.user.sub, {
    $pull: { mutedStories: req.params.userId },
  });

  res.json({ status: "UNMUTED" });
};

export const reactToStory = async (req, res) => {
  const { storyId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.sub;

  if (!emoji) {
    return res.status(400).json({ message: "Emoji required" });
  }

  await StoryReaction.findOneAndUpdate(
    { story: storyId, user: userId },
    { emoji },
    { upsert: true, new: true }
  );

  res.json({ status: "REACTION_RECORDED" });
};

export const getStoryReactions = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user.sub;

  const story = await Story.findById(storyId).select("user");
  if (!story || story.user.toString() !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const reactions = await StoryReaction.find({ story: storyId })
    .populate("user", "username profileImage");

  res.json(reactions);
};

export const addStoryToHighlight = async (req, res) => {
  const { highlightId, storyId } = req.params;
  const userId = req.user.sub;

  const highlight = await StoryHighlight.findById(highlightId);
  if (!highlight || highlight.user.toString() !== userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await StoryHighlight.findByIdAndUpdate(highlightId, {
    $addToSet: { stories: storyId },
  });

  res.json({ status: "ADDED_TO_HIGHLIGHT" });
};

export const getUserHighlights = async (req, res) => {
  const { userId } = req.params;

  const highlights = await StoryHighlight.find({ user: userId })
    .populate("stories");

  res.json(highlights);
};

export const flushStoryViews = async () => {
  const keys = await redis.keys("story:*:views");

  for (const key of keys) {
    const storyId = key.split(":")[1];
    const viewers = await redis.smembers(key);

    if (viewers.length) {
      await Story.findByIdAndUpdate(storyId, {
        $inc: { viewsCount: viewers.length },
      });

      await redis.del(key);
    }
  }
};



