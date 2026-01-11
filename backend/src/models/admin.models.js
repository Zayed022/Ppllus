import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    role: {
      type: String,
      enum: ["MODERATOR", "SUPER_ADMIN"],
      default: "MODERATOR",
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
