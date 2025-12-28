import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateRefreshAndAccessToken from "../utils/token.js";
import jwt from "jsonwebtoken";

// register

const registerUser = asyncHandler(async (req, res) => {
  const { name, role, email, password } = req.body;

  //Validate all required fields
  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  //Count existing users
  const userCount = await User.countDocuments();

  //First user MUST be admin

  

    // if (userCount === 0 && role !== "admin") {
    //   throw new ApiError(400, "First user must be an admin");
    // }
  

  // After first user, close public registration
  if (userCount > 0) {
    throw new ApiError(403, "Registration is closed. Contact admin to create your account");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "Email already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully"
      )
    );
});


//login

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if email is provided
  if (!email) throw new ApiError(400, "Email is required");

  // find user in DB
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "User does not exist");


  // verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

  // generate tokens
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  //remove sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // cookie options (secure storage)
  const options = {
    httpOnly: true, // prevent JS access
    secure: process.env.NODE_ENV === "production",   // send only over HTTPS

  };

  // send response with cookies + user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    );
});

//logout

const logoutUser = asyncHandler(async (req, res) => {
  //Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: "" } },
    { new: true }
  );

  // cookie options (secure & httpOnly)
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

  };

  // clear cookies + send response
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "User fetched successfully"
      )
    );
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Check if refresh token matches
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  // Generate new tokens
  const { accessToken, refreshToken } =
    await generateRefreshAndAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

export { registerUser, login, logoutUser, getCurrentUser, refreshAccessToken };
