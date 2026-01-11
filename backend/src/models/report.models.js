import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ["USER", "REEL", "POST", "COMMENT"],
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ["SPAM", "ABUSE", "NSFW", "HATE", "OTHER"],
      required: true,
    },
  },
  { timestamps: true }
);

reportSchema.index({ entityType: 1, entityId: 1 });

export default mongoose.model("Report", reportSchema);
