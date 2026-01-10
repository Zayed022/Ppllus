import mongoose, { Schema } from "mongoose";

const offerSchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    pointsRequired: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    radiusMeters: {
      type: Number,
      default: 500, // default discovery radius
    },

    validFrom: {
      type: Date,
      required: true,
      index: true,
    },

    validTill: {
      type: Date,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    maxRedemptions: {
      type: Number, // optional limit
    },

    redeemedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



// Shop offers listing
offerSchema.index({ shop: 1, isActive: 1 });

// Fast valid offers lookup
offerSchema.index({ validFrom: 1, validTill: 1 });

// High-performance discovery
offerSchema.index({
  isActive: 1,
  pointsRequired: 1,
  validTill: 1,
});

export default mongoose.model("Offer", offerSchema);
