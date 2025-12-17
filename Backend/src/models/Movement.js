import mongoose from "mongoose";

const MovementSchema = new mongoose.Schema(
  {
    individualAssetId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IndividualAsset",
        required: true,
      },
    ],
    fromLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    toLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    actionType: {
      type: String,
      enum: ["TRANSFER", "INWARD", "OUTWARD", "SPOILED", "REPAIR"],
      required: true,
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // if the movement invloves an issue then link them
    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movement", MovementSchema);
