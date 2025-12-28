import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Location from "../models/Location.js";

//  create user (admin)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, assignedLocation } = req.body;


  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password and role are required");
  }

  //  check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  //  validate location requirement based on role
  if (["admin", "labIncharge"].includes(role)) {
    if (!assignedLocation) {
      throw new ApiError(400, `${role} requires an assigned location`);
    }

    // check if location exists
    const location = await Location.findById(assignedLocation);
    if (!location) {
      throw new ApiError(404, "Assigned location not found");
    }

    //  check if location already has an incharge (for labIncharge role)
    if (role === "labIncharge") {
      const existingIncharge = await User.findOne({
        role: "labIncharge",
        assignedLocation: assignedLocation,
        status: "active"
      });

      if (existingIncharge) {
        throw new ApiError(
          409,
          `${location.name} already has an incharge: ${existingIncharge.name}`
        );
      }

      // update location's incharge field
      await Location.findByIdAndUpdate(assignedLocation, {
        locationInchargeId: null  // Will be set after user is created
      });
    }
  }

  //  practicalIncharge and labAssistant should NOT have location
  if (["practicalIncharge", "labAssistant"].includes(role) && assignedLocation) {
    throw new ApiError(400, `${role} should not have an assigned location`);
  }

  // create user
  const userData = {
    name,
    email,
    password,
    role
  };

  if (["admin", "labIncharge"].includes(role)) {
    userData.assignedLocation = assignedLocation;
  }

  const user = await User.create(userData);

  //  update location's incharge field if labIncharge
  if (role === "labIncharge" && assignedLocation) {
    await Location.findByIdAndUpdate(assignedLocation, {
      locationInchargeId: user._id
    });
  }

  // remove sensitive fields
  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User created successfully"
      )
    );
});

//  get all user
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, count: users.length },
        "Users fetched successfully"
      )
    );
});

//  get one user 
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        "User fetched successfully"
      )
    );
});

//  update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, assignedLocation } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //  prevent changing email to existing one
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ApiError(409, "Email already exists");
    }
  }

  //  if role is being changed, validate location logic
  const newRole = role || user.role;

  if (["admin", "labIncharge"].includes(newRole)) {
    if (!assignedLocation && !user.assignedLocation) {
      throw new ApiError(400, `${newRole} requires an assigned location`);
    }
  }

  //  if changing to practicalIncharge or labAssistant, remove location
  if (["practicalIncharge", "labAssistant"].includes(newRole)) {
    // remove from old location's incharge field if they were an incharge
    if (user.assignedLocation && user.role === "labIncharge") {
      await Location.findByIdAndUpdate(user.assignedLocation, {
        locationInchargeId: null
      });
    }
    user.assignedLocation = undefined;
  }

  //  if location is being changed for labIncharge
  if (newRole === "labIncharge" && assignedLocation && assignedLocation !== user.assignedLocation?.toString()) {
    const location = await Location.findById(assignedLocation);
    if (!location) {
      throw new ApiError(404, "New location not found");
    }

    // check if new location already has an incharge
    const existingIncharge = await User.findOne({
      role: "labIncharge",
      assignedLocation: assignedLocation,
      _id: { $ne: id },
      status: "active"
    });

    if (existingIncharge) {
      throw new ApiError(409, `${location.name} already has an incharge`);
    }

    // remove from old location
    if (user.assignedLocation) {
      await Location.findByIdAndUpdate(user.assignedLocation, {
        locationInchargeId: null
      });
    }

    // update new location
    await Location.findByIdAndUpdate(assignedLocation, {
      locationInchargeId: id
    });
  }

  // update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (assignedLocation !== undefined) {
    user.assignedLocation = assignedLocation === null ? undefined : assignedLocation;
  }

  await user.save();

  const updatedUser = await User.findById(id)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "User updated successfully"
      )
    );
});

//  delete user status inactive 
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // admin cant delete himself
  if (req.user._id.toString() === id) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //  remove from location's incharge field if they are an incharge
  if (user.assignedLocation && user.role === "labIncharge") {
    await Location.findByIdAndUpdate(user.assignedLocation, {
      locationInchargeId: null
    });
  }

  //  Soft delete set status to inactive
  user.status = "inactive";
  user.refreshToken = "";  // Clear refresh token
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { _id: user._id, status: user.status } },
        "User deactivated successfully"
      )
    );
});

//  reactive user 
const reactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.status === "active") {
    throw new ApiError(400, "User is already active");
  }

  user.status = "active";
  await user.save();

  const reactivatedUser = await User.findById(id)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: reactivatedUser },
        "User reactivated successfully"
      )
    );
});

//  assign location to user 
const assignLocationToUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { locationId } = req.body;

  if (!locationId) {
    throw new ApiError(400, "Location ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const location = await Location.findById(locationId);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  //  validate role can have location
  if (!["admin", "labIncharge"].includes(user.role)) {
    throw new ApiError(
      400,
      `Cannot assign location to ${user.role}. Only admin and labIncharge can have locations.`
    );
  }

  //  check if location already has an incharge (for labIncharge)
  if (user.role === "labIncharge") {
    const existingIncharge = await User.findOne({
      role: "labIncharge",
      assignedLocation: locationId,
      _id: { $ne: userId },
      status: "active"
    });

    if (existingIncharge) {
      throw new ApiError(409, `${location.name} already has an incharge`);
    }

    // remove from old location
    if (user.assignedLocation) {
      await Location.findByIdAndUpdate(user.assignedLocation, {
        locationInchargeId: null
      });
    }

    // update new location
    await Location.findByIdAndUpdate(locationId, {
      locationInchargeId: userId
    });
  }

  user.assignedLocation = locationId;
  await user.save();

  const updatedUser = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("assignedLocation", "name type");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Location assigned successfully"
      )
    );
});

//  change password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "New password is required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;  // Will be hashed by pre-save hook
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password changed successfully"
      )
    );
});

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  reactivateUser,
  assignLocationToUser,
  changeUserPassword
};