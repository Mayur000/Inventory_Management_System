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

    rate : {
        type : Number
      },

      totalQuantityBought:{
        type:Number,
      },

      totalCost : {
        type : Number,
      },
      billNo:{
        type:String,
      },
      DPRno:{
        type:String
      }

    //more attributes can be added later on
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AssetType", AssetTypeSchema);
