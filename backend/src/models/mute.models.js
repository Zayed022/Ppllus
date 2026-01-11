import mongoose, { Schema } from "mongoose";

const muteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mutedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

muteSchema.index({ user: 1, mutedUser: 1 }, { unique: true });

export default mongoose.model("Mute", muteSchema);
