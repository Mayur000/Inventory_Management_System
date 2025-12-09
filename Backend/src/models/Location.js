import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["LAB", "STORE", "SCRAP"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Location", LocationSchema);
