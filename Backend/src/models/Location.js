import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lab", "mainStore", "stock", "room"],
      required: true,
    },

    // if that location has an incharge
    locationInchargeId :{
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Location", LocationSchema);
