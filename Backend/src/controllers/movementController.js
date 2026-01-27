import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Movement from "../models/Movement.js";
import IndividualAsset from "../models/IndividualAsset.js";
import Location from "../models/Location.js";
import Issue from "../models/Issue.js";
import AssetType from "../models/AssetType.js";  

// helper function to check low stock
const checkLowStock = async (locationId, movedAssetTypeIds) => {
  // only check stock/mainStore locations
  const location = await Location.findById(locationId);
  if (!location || !["stock", "mainStore"].includes(location.type)) {
    return [];
  }

  const lowStockItems = [];

  // check each asset type that was moved
  for (const assetTypeId of movedAssetTypeIds) {
    // get AssetType to check minQuantity
    const assetType = await AssetType.findById(assetTypeId);
    
    if (!assetType || !assetType.minQuantity || assetType.minQuantity === 0) {
      continue; // Skip if no minQuantity set or is 0
    }

    // count current quantity at this location 
    const currentQuantity = await IndividualAsset.countDocuments({
      assetTypeId: assetTypeId,
      locationId: locationId,
      status: { $ne: "discarded" }  // don't count discarded items
    });

    // compare: current vs minimum
    if (currentQuantity <= assetType.minQuantity) {
      lowStockItems.push({
        assetType: {
          _id: assetType._id,
          name: assetType.name,
          configuration: assetType.configuration
        },
        currentQuantity,
        minQuantity: assetType.minQuantity,
        deficit: assetType.minQuantity - currentQuantity
      });
    }
  }

  return lowStockItems;
};

//  create transfer 
const createTransfer = asyncHandler(async (req, res) => {
  const {
    individualAssetIds,
    fromLocationId,
    toLocationId,
    actionType,
    remark,
    issues
  } = req.body;

  
  if (!individualAssetIds || individualAssetIds.length === 0) {
    throw new ApiError(400, "At least one asset must be selected");
  }

  if (!fromLocationId || !toLocationId) {
    throw new ApiError(400, "From and To locations are required");
  }

  if (!actionType) {
    throw new ApiError(400, "Action type is required");
  }

  if (fromLocationId === toLocationId) {
    throw new ApiError(400, "From and To locations cannot be the same");
  }

  //  locations must exist
  const [fromLocation, toLocation] = await Promise.all([
    Location.findById(fromLocationId),
    Location.findById(toLocationId)
  ]);

  if (!fromLocation) {
    throw new ApiError(404, "From location not found");
  }

  if (!toLocation) {
    throw new ApiError(404, "To location not found");
  }

  //  edge case 1: cannot transfer FROM scrap
  if (fromLocation.type === "scrap") {
    throw new ApiError(400, "Cannot transfer assets from Scrap location");
  }

  //  edge case 2: for "discard" action, toLocation MUST be scrap
  if (actionType === "discard" && toLocation.type !== "scrap") {
    throw new ApiError(400, "Discard action requires destination to be Scrap location");
  }

  //  edge case 3: for "transfer" action, toLocation should NOT be scrap
  if (actionType === "transfer" && toLocation.type === "scrap") {
    throw new ApiError(400, 'Use "discard" action type to move assets to Scrap');
  }

  //  edge case 4: require remark when discarding
  if (actionType === "discard" && !remark?.trim()) {
    throw new ApiError(400, "Remark is required when discarding assets");
  }

  //  Role-based permission check - only Lab Assistant and Admin can create
  const user = req.user;

  if (!["admin", "labAssistant"].includes(user.role)) {
    throw new ApiError(
      403,
      "Only Lab Assistants and Admins can create movements"
    );
  }


  //  validate all assets exist
  const assets = await IndividualAsset.find({
    _id: { $in: individualAssetIds }
  });

  if (assets.length !== individualAssetIds.length) {
    throw new ApiError(404, "Some assets not found");  
  }

  //  edge case 5: check all assets are at fromLocation
  const assetsNotAtLocation = assets.filter(
    (asset) => asset.locationId.toString() !== fromLocationId
  );

  if (assetsNotAtLocation.length > 0) {
    const serialNumbers = assetsNotAtLocation.map((a) => a.serialNumber).join(", ");
    throw new ApiError(
      400,
      `Assets not at source location: ${serialNumbers}`
    );
  }

  //  edge case 6: cannot transfer already discarded assets
  const discardedAssets = assets.filter(
    (asset) => asset.status === "discarded"
  );

  if (discardedAssets.length > 0) {
    const serialNumbers = discardedAssets.map((a) => a.serialNumber).join(", ");
    throw new ApiError(
      400,
      `Cannot transfer discarded assets: ${serialNumbers}`
    );
  }

  //  MANDATORY: Movement must be linked to issue(s)
  if (!issues || issues.length === 0) {
    throw new ApiError(400, "Movement must be linked to at least one issue");
  }

// Fetch all issues
    const issueRecords = await Issue.find({ _id: { $in: issues } });

  if (issueRecords.length !== issues.length) {
    throw new ApiError(404, "Some issues not found");
  }

  //  validate each issue comprehensively
  for (const issue of issueRecords) {
    // 1. check issue status
    if (issue.status !== "created") {
      throw new ApiError(
        400,
        `Issue "${issue.title}" is already ${issue.status}. Only unresolved issues can be linked to movements.`
      );
    }

    // 2. check issue location matches source location
    if (issue.locationId.toString() !== fromLocationId) {
      throw new ApiError(
        400,
        `Issue "${issue.title}" is reported for a different location. Expected: ${fromLocationId}, Found: ${issue.locationId}`
      );
    }

    // 3. check if movement's assets are part of the issue
    const issueAssetIds = issue.individualAssetIds.map(id => id.toString());
    const movementAssetIds = individualAssetIds.map(id => id.toString());

    // all movement assets must be in the issue
    const unmatchedAssets = movementAssetIds.filter(
      id => !issueAssetIds.includes(id)
    );

    if (unmatchedAssets.length > 0) {
      const unmatchedSerialNumbers = assets
        .filter(a => unmatchedAssets.includes(a._id.toString()))
        .map(a => a.serialNumber)
        .join(", ");

      throw new ApiError(
        400,
        `These assets are not part of issue "${issue.title}": ${unmatchedSerialNumbers}`
      );
    }
  }

  // Track which asset types are being moved (for low stock check)
  const movedAssetTypeIds = [...new Set(assets.map(a => a.assetTypeId.toString()))];

  // transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //  step 1: Update each IndividualAsset (location + status)
    const newStatus =
      actionType === "discard" || toLocation.type === "scrap"
        ? "discarded"
        : toLocation.type === "stock" || toLocation.type === "mainStore"
          ? "inStock"
          : "inUse";

    await IndividualAsset.updateMany(
      { _id: { $in: individualAssetIds } },
      {
        locationId: toLocationId,
        status: newStatus
      },
      { session }
    );

    //  step 2: Create Movement record
    const movement = await Movement.create(
      [
        {
          individualAssetIds,
          fromLocationId,
          toLocationId,
          actionType,
          doneBy: req.user._id,
          remark: remark || "",
          issues: issues || [],
          date: new Date()
        }
      ],
      { session }
    );

    //  step 3: Update linked issues to "inProgress"
    if (issues && issues.length > 0) {
      await Issue.updateMany(
        { _id: { $in: issues } },
        { status: "inProgress" },
        { session }
      );
    }

    //  commit transaction
    await session.commitTransaction();


    // check low stock AFTER transaction commits
    let lowStockWarning = null;
    if (["stock", "mainStore"].includes(fromLocation.type)) {
      const lowStock = await checkLowStock(fromLocationId, movedAssetTypeIds);
      
      if (lowStock.length > 0) {
        lowStockWarning = {
          message: "⚠️ Warning: Some items are now below minimum stock level",
          items: lowStock
        };
      }
    }

    // fetch populated movement record
    const populatedMovement = await Movement.findById(movement[0]._id)
      .populate("individualAssetIds", "serialNumber status")
      .populate("fromLocationId", "name type")
      .populate("toLocationId", "name type")
      .populate("doneBy", "name email role")
      .populate("issues", "title status");

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          movement: populatedMovement,
          lowStockWarning  
        },
        `${actionType === "discard" ? "Assets discarded" : "Transfer completed"} successfully`
      )
    );
  } catch (error) {
    //  rollback on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

//  get all movements
const getAllMovements = asyncHandler(async (req, res) => {
  const {
    fromLocationId,
    toLocationId,
    actionType,
    doneBy,
    startDate,
    endDate,
    page = 1,
    limit = 50
  } = req.query;

  const filter = {};

  // apply filters
  if (fromLocationId) filter.fromLocationId = fromLocationId;
  if (toLocationId) filter.toLocationId = toLocationId;
  if (actionType) filter.actionType = actionType;
  if (doneBy) filter.doneBy = doneBy;

    // date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

    //  role-based filtering
  const user = req.user;

  if (user.role === "practicalIncharge") {
    throw new ApiError(403, "Practical Incharges do not have access to movement records");
  }

  if (user.role === "labIncharge") {
        // lab Incharge can only see movements involving their location
    filter.$or = [
      { fromLocationId: user.assignedLocation },
      { toLocationId: user.assignedLocation }
    ];
  }
    // admin and Lab Assistant see all movements

  const skip = (page - 1) * limit;

  const [movements, total] = await Promise.all([
    Movement.find(filter)
      .populate("individualAssetIds", "serialNumber status")
      .populate("fromLocationId", "name type")
      .populate("toLocationId", "name type")
      .populate("doneBy", "name email role")
      .populate("issues", "title status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Movement.countDocuments(filter)
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        movements,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      },
      "Movements fetched successfully"
    )
  );
});

//  get one movement 
const getMovementById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movement = await Movement.findById(id)
    .populate("individualAssetIds", "serialNumber status")
    .populate({
      path: "individualAssetIds",
      populate: { path: "assetTypeId", select: "name configuration" }
    })
    .populate("fromLocationId", "name type")
    .populate("toLocationId", "name type")
    .populate("doneBy", "name email role")
    .populate("issues", "title status reason");

  if (!movement) {
    throw new ApiError(404, "Movement not found");
  }

  //  role-based access
  const user = req.user;

  if (user.role === "practicalIncharge") {
    throw new ApiError(403, "Practical Incharges do not have access to movement records");
  }

  if (user.role === "labIncharge") {
    if (
      movement.fromLocationId._id.toString() !== user.assignedLocation?.toString() &&
      movement.toLocationId._id.toString() !== user.assignedLocation?.toString()
    ) {
      throw new ApiError(403, "You don't have access to this movement");
    }
  }
    // admin and lab assistant can view any movement

  return res.status(200).json(
    new ApiResponse(200, { movement }, "Movement fetched successfully")
  );
});

//  get asset history 
const getAssetHistory = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

    // check if asset exists
  const asset = await IndividualAsset.findById(assetId)
    .populate("assetTypeId", "name configuration")
    .populate("locationId", "name type");

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

    // get all movements involving this asset
  const movements = await Movement.find({
    individualAssetIds: assetId
  })
    .populate("fromLocationId", "name type")
    .populate("toLocationId", "name type")
    .populate("doneBy", "name email role")
    .populate("issues", "title status")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        asset,
        history: movements,
        totalMovements: movements.length
      },
      "Asset history fetched successfully"
    )
  );
});

//  get movement location history
const getLocationMovements = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const { type = "all" } = req.query;

  const location = await Location.findById(locationId);
  if (!location) {
    throw new ApiError(404, "Location not found");
  }

    //  Role-based access for location
  const user = req.user;

  if (user.role === "practicalIncharge") {
    throw new ApiError(403, "Practical Incharges do not have access to movement records");
  }

  if (user.role === "labIncharge") {
    if (locationId !== user.assignedLocation?.toString()) {
      throw new ApiError(403, "You can only view movements for your assigned location");
    }
  }

  const filter = {};

  if (type === "inward") {
    filter.toLocationId = locationId;
  } else if (type === "outward") {
    filter.fromLocationId = locationId;
  } else {
    filter.$or = [{ fromLocationId: locationId }, { toLocationId: locationId }];
  }

  const movements = await Movement.find(filter)
    .populate("individualAssetIds", "serialNumber status")
    .populate("fromLocationId", "name type")
    .populate("toLocationId", "name type")
    .populate("doneBy", "name email role")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        location,
        movements,
        count: movements.length
      },
      "Location movements fetched successfully"
    )
  );
});

export {
  createTransfer,
  getAllMovements,
  getMovementById,
  getAssetHistory,
  getLocationMovements
};