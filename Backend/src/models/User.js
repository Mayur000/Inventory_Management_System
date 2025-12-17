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

    //email password requird for login
    email : {
      type : String,
      unique : true,
    },

    password : {
      type : String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
