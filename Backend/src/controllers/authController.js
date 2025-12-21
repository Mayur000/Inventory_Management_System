import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateRefreshAndAccessToken from "../utils/token.js";


// register

const registerUser = asyncHandler(async (req, res) => {
  const { name, role, email, password } = req.body;

  //check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "email already exists");
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
    sameSite: "strict",
  };

  // send response with cookies + user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser},
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
    sameSite: "strict",
  };

  // clear cookies + send response
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, login, logoutUser};
