import mongoose, { model } from "mongoose";

const AssetTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AssetType", AssetTypeSchema);
