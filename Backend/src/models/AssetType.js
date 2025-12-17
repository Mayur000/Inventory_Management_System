import mongoose, { model } from "mongoose";

const AssetTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    configuration: {
      type: String,
      required: true,
    },

    //more attributes can be added later on
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AssetType", AssetTypeSchema);
