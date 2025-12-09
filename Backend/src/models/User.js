import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "LAB_ASSISTANT", "LAB_INCHARGE", "PRATICAL_INCHARGE"],
      required: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
