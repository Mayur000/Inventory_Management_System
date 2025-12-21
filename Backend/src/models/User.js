import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import joi from "joi";

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
    email : {
      type : String,
      unique : true,
      required:true,
    },

    password : {
      type : String,
      required:true,
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
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"}
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
