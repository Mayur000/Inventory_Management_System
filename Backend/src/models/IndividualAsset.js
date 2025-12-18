import mongoose from "mongoose";

const IndividualAssetSchema = new mongoose.Schema(
  {
    assetTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetType",
      required: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Working", "Discarded"],
      default: "Working",
    },
    purchasedDate: {
      type: Date,
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("IndividualAsset", IndividualAssetSchema);
