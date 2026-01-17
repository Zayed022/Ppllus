import Follow from "../models/follow.models.js";
import User from "../models/users.models.js";
import { emitEvent } from "../events/emitEvent.js";

export const followUser = async (req, res) => {
  const followerId = req.user.sub;
  const { userId: followingId } = req.params;

  if (followerId === followingId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const targetUser = await User.findById(followingId).select("visibility status");
  if (!targetUser || targetUser.status !== "ACTIVE") {
    return res.status(404).json({ message: "User not found" });
  }

  const status =
    targetUser.visibility === "PRIVATE" ? "REQUESTED" : "ACTIVE";

  try {
    const follow = await Follow.create({
      follower: followerId,
      following: followingId,
      status,
    });

    // 🔔 EMIT EVENT (ONLY IF ACTIVE)
    if (status === "ACTIVE") {
      emitEvent({
        type: "FOLLOW",
        actorId: followerId,
        targetUserId: followingId,
        entityId: followerId,
      });
    }

    res.json({
      message:
        status === "ACTIVE"
          ? "Followed successfully"
          : "Follow request sent",
      follow,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already following" });
    }
    throw err;
  }
};


export const unfollowUser = async (req, res) => {
    const followerId = req.user.sub;
    const { userId: followingId } = req.params;
  
    await Follow.deleteOne({
      follower: followerId,
      following: followingId,
    });
  
    res.json({ message: "Unfollowed successfully" });
};

export const acceptFollowRequest = async (req, res) => {
  const userId = req.user.sub;
  const { followerId } = req.params;

  const updated = await Follow.findOneAndUpdate(
    {
      follower: followerId,
      following: userId,
      status: "REQUESTED",
    },
    { status: "ACTIVE" },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Request not found" });
  }

  // 🔔 EMIT EVENT
  emitEvent({
    type: "FOLLOW",
    actorId: followerId,
    targetUserId: userId,
    entityId: followerId,
  });

  res.json({ message: "Follow request accepted" });
};

export const rejectFollowRequest = async (req, res) => {
    const userId = req.user.sub;
    const { followerId } = req.params;
  
    await Follow.deleteOne({
      follower: followerId,
      following: userId,
      status: "REQUESTED",
    });
  
    res.json({ message: "Follow request rejected" });
};
  
export const getFollowers = async (req, res) => {
    const { userId } = req.params;
  
    const followers = await Follow.find({
      following: userId,
      status: "ACTIVE",
    })
      .populate("follower", "username profileImage")
      .limit(50);
  
    res.json(followers);
};

export const getFollowing = async (req, res) => {
    const { userId } = req.params;
  
    const following = await Follow.find({
      follower: userId,
      status: "ACTIVE",
    })
      .populate("following", "username profileImage")
      .limit(50);
  
    res.json(following);
};
  
export const getFollowRequests = async (req, res) => {
    const userId = req.user.sub;
  
    const requests = await Follow.find({
      following: userId,
      status: "REQUESTED",
    }).populate("follower", "username profileImage");
  
    res.json(requests);
};
    