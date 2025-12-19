import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    //name=Scrap and type=scrap, name=MainStore type=mainStore, name=DepartmentStock || Stock, type=stock, 
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lab", "mainStore", "stock", "room", "scrap"],
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
