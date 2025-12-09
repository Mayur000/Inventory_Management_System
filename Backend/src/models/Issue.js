import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    individualAssetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualAsset",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "InProgress", "Resolved", "Rejected"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", IssueSchema);
