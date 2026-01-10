
import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
  {
    
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "REQUESTED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Prevent duplicate follows
 * A user can follow another user only once
 */
followSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

/**
 * Fast followers list
 */
followSchema.index({ following: 1, createdAt: -1 });

/**
 * Fast following list
 */
followSchema.index({ follower: 1, createdAt: -1 });

/**
 * For private account approval queues
 */
followSchema.index({ following: 1, status: 1 });



followSchema.statics.followUser = function (followerId, followingId) {
  if (followerId.equals(followingId)) {
    throw new Error("Users cannot follow themselves");
  }

  return this.create({
    follower: followerId,
    following: followingId,
    status: "ACTIVE",
  });
};

followSchema.statics.unfollowUser = function (followerId, followingId) {
  return this.deleteOne({
    follower: followerId,
    following: followingId,
  });
};



export default mongoose.model("Follow", followSchema);
