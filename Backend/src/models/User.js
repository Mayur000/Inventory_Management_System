import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "labAssistant", "labIncharge", "practicalIncharge"],
      required: true,
    },

    //email password requird for login

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]  // email validation
    },

    password: {
      type: String,
      required: true,
    },

    // assignedLocation: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Location",
    //   required: function () {
    //     return ["admin", "labIncharge"].includes(this.role);
    //   }
    // },

    assignedLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: function () {
        //Only enforce in production OR if location exists
        if (process.env.NODE_ENV === "development") {
          return false;  // skip validation during dev
        }
        return ["admin", "labIncharge",].includes(this.role);
      }
    },

    refreshToken: String,          // for JWT refresh token
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function () { 
  //run only if password is modified
  if (!this.isModified("password")) return;  
  // hashing the password
  this.password = await bcrypt.hash(this.password, 12);
   
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,       // user id
      email: this.email, // user identity
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, // only user id (minimal info)
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};
export default mongoose.model("User", UserSchema);
