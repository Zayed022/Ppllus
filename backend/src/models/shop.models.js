import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true, // fast filtering (food, retail, pharmacy)
    },

    description: {
      type: String,
      maxlength: 500,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    address: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "PENDING",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// Geo discovery (500m nearby search)
shopSchema.index({ location: "2dsphere" });

// Owner lookup
shopSchema.index({ owner: 1 });

// Category + approval filtering
shopSchema.index({ category: 1, status: 1 });

export default mongoose.model("Shop", shopSchema);
