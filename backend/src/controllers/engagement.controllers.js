import EngagementEvent from "../models/engagementEvent.models.js";
import Reel from "../models/reel.models.js";
import { processReelViewReward } from "../services/reward.service.js";
import { emitEvent } from "../events/emitEvent.js";
import { isFeatureEnabled } from "../services/featureFlag.service.js";


export const recordReelView = async (req, res) => {
  const { reelId, watchTime } = req.body;
  const userId = req.user.sub;

  const reel = await Reel.findById(reelId).select("creator createdAt");
  if (!reel) {
    return res.status(404).json({ message: "Reel not found" });
  }

  // 1️⃣ Store engagement (MongoDB)
  await EngagementEvent.create({
    user: userId,
    contentId: reelId,
    contentType: "REEL",
    eventType: "VIEW",
    watchTime,
  });

  // 2️⃣ Emit system event (analytics / notifications / abuse)
  emitEvent({
    type: "REEL_VIEW",
    actorId: userId,
    targetUserId: reel.creator,
    entityId: reelId,
    watchTime,
    createdAt: reel.createdAt,
  });
  

  // 3️⃣ Feature-flagged wallet reward (SAFE)
  if (await isFeatureEnabled("wallet_rewards", userId)) {
    processReelViewReward({
      userId,
      reelId,
      watchTime,
    }).catch(console.error);
  }

  // 4️⃣ Respond immediately (never block)
  res.json({ status: "OK" });
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
    
