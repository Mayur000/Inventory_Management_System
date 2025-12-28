import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Location from "../models/Location.js";
import User from "../models/User.js";

//create location 
const createLocation = asyncHandler(async (req, res) => {
  const { name, type, locationInchargeId } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required");
  }

  // edge case 1: Prevent duplicate location names
  const existingLocation = await Location.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') }  // case-insensitive check
  });
  
  if (existingLocation) {
    throw new ApiError(409, "Location with this name already exists");
  }

  // edge case 2: If incharge is provided, validate
  if (locationInchargeId) {
    const incharge = await User.findById(locationInchargeId);
    
    if (!incharge) {
      throw new ApiError(404, "Incharge user not found");
    }

    // Check if user is actually an incharge
    if (!["admin", "labIncharge"].includes(incharge.role)) {
      throw new ApiError(400, "Selected user is not an incharge");
    }

    // edge case 3 : Check if this incharge is already assigned elsewhere
    const alreadyAssigned = await Location.findOne({ 
      locationInchargeId: locationInchargeId 
    });
    
    if (alreadyAssigned) {
      throw new ApiError(
        409, 
        `This incharge is already assigned to ${alreadyAssigned.name}`
      );
    }

    // update user's assignedLocation
    await User.findByIdAndUpdate(locationInchargeId, {
      assignedLocation: null  // Will be set after location is created
    });
  }

  // create location
  const location = await Location.create({
    name,
    type,
    locationInchargeId: locationInchargeId || null
  });

  // update incharge's assignedLocation field
  if (locationInchargeId) {
    await User.findByIdAndUpdate(locationInchargeId, {
      assignedLocation: location._id
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { location },
        "Location created successfully"
      )
    );
});

//  get all location 
const getAllLocations = asyncHandler(async (req, res) => {
  const { type } = req.query;  // optional filter by type

  const filter = {};
  if (type) {
    filter.type = type;
  }

  const locations = await Location.find(filter)
    .populate("locationInchargeId", "name email role")  // populate incharge details
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { locations, count: locations.length },
        "Locations fetched successfully"
      )
    );
});

//  get one location
const getLocationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id)
    .populate("locationInchargeId", "name email role");

  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { location },
        "Location fetched successfully"
      )
    );
});

// get inventory using location 
// const getLocationInventory = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const location = await Location.findById(id);
//   if (!location) {
//     throw new ApiError(404, "Location not found");
//   }

//   

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { 
//           location,
//           inventory: []  
//         },
//         "Location inventory fetched successfully"
//       )
//     );
// });

// assign change location 
const assignIncharge = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const { inchargeId } = req.body;

  if (!inchargeId) {
    throw new ApiError(400, "Incharge ID is required");
  }

  const location = await Location.findById(locationId);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  const incharge = await User.findById(inchargeId);
  if (!incharge) {
    throw new ApiError(404, "Incharge user not found");
  }

  // Validate role
  if (!["admin", "labIncharge", "practicalIncharge"].includes(incharge.role)) {
    throw new ApiError(400, "Selected user is not an incharge");
  }

  //  edge case 3: check if already assigned elsewhere
  const alreadyAssigned = await Location.findOne({ 
    locationInchargeId: inchargeId,
    _id: { $ne: locationId }  // exclude current location
  });
  
  if (alreadyAssigned) {
    throw new ApiError(
      409, 
      `This incharge is already assigned to ${alreadyAssigned.name}`
    );
  }

  // remove old incharge
  if (location.locationInchargeId) {
    await User.findByIdAndUpdate(location.locationInchargeId, {
      assignedLocation: null
    });
  }

  // update location with new incharge
  location.locationInchargeId = inchargeId;
  await location.save();

  // update new incharge's assignedLocation
  await User.findByIdAndUpdate(inchargeId, {
    assignedLocation: locationId
  });

  const updatedLocation = await Location.findById(locationId)
    .populate("locationInchargeId", "name email role");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { location: updatedLocation },
        "Incharge assigned successfully"
      )
    );
});

//  remove incharge 
const removeIncharge = asyncHandler(async (req, res) => {
  const { locationId } = req.params;

  const location = await Location.findById(locationId);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }

  if (!location.locationInchargeId) {
    throw new ApiError(400, "No incharge assigned to this location");
  }

  // update user's assignedLocation
  await User.findByIdAndUpdate(location.locationInchargeId, {
    assignedLocation: null
  });

  // remove from location
  location.locationInchargeId = null;
  await location.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { location },
        "Incharge removed successfully"
      )
    );
});

export {
  createLocation,
  getAllLocations,
  getLocationById,
//   getLocationInventory,
  assignIncharge,
  removeIncharge
};