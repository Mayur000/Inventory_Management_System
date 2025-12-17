import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inventory", InventorySchema);
