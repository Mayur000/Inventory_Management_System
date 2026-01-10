import mongoose from "mongoose";
import IndividualAsset from "../models/IndividualAsset.js";
import Location from "../models/Location.js"
import AssetType from "../models/AssetType.js";
import { createIndividualAssetSchema, updateIndividualAssetSchema, getAllIndividualAssetsQuerySchema, getAssetSummaryQuerySchema } from "../validators/individualAssetValidation.js";

// Helper function to escape special regex characters
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// CREATE SINGLE ASSET
//Problem if locationId is of type=stock, and statuss of  individualAsset=inUse then it is logically wrong, if location type is stock then status should be insStock
//But this logical check is not there in create single asset controller
//hence even with status=inUse location=stock this is also saving in the DB without any error
//So fix this
export const createIndividualAsset = async (req, res) => {
    try {
        const { error, value } = createIndividualAssetSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Ensure assetTypeId and locationId exist
        const assetTypeExists = await AssetType.findById(value.assetTypeId);
        if (!assetTypeExists) {
            return res.status(400).json({ success: false, message: "Invalid assetTypeId." });
        }

        const locationExists = await Location.findById(value.locationId);
        if (!locationExists) {
            return res.status(400).json({ success: false, message: "Invalid locationId." });
        }
        if (value.status === "discarded" && locationExists.type !== "scrap") {
            return res.status(400).json({ success: false, message: "Discarded assets must be stored in scrap location." });
        }
        if (value.status === "inStock" && locationExists.type !== "stock") {
            return res.status(400).json({ success: false, message: "In Stock assets must be stored in stock location." });
        }


        const asset = await IndividualAsset.create(value);
        return res.status(201).json({ success: true, message: "Individual asset created successfully.", data: asset });
    } catch (error) {
        console.error("Error in createIndividualAsset:", error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Please send valid data as per guidelines." });
        }
        if (error.code === 11000) { // Duplicate serialNumber
            return res.status(400).json({ success: false, message: "Serial number already exists." });
        }
        return res.status(500).json({ success: false, message: "Failed to create individual asset." });
    }
};

// GET ALL ASSETS --joi valdations yet to add
//add validations for all filter and alos prevent regex  or nosql injection which can happpen through req.pparams
export const getAllIndividualAssets = async (req, res) => {
    try {
        // Joi validation
        const { error, value } = getAllIndividualAssetsQuerySchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        let { assetTypeId, locationId, status, page, limit, search } = value;

        // Role-based override
        if (req.user.role === "labIncharge") {
            locationId = req.user.locationId;
        }

        const filter = {};
        if (assetTypeId) filter.assetTypeId = assetTypeId;
        if (locationId) filter.locationId = locationId;
        if (status) filter.status = status;

        // SAFE SEARCH
        if (search) {
            const safeSearch = escapeRegex(search);
            const regex = new RegExp(safeSearch, "i");

            filter.$or = [
                { serialNumber: regex }
            ];
        }

        const assets = await IndividualAsset.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("assetTypeId locationId").lean();

        const total = await IndividualAsset.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            data: assets
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch individual assets."
        });
    }
};


// GET SINGLE ASSET
export const getIndividualAssetById = async (req, res) => {
    try {

        const { individualAssetId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(individualAssetId)) {
            return res.status(400).json({ success: false, message: "Valid asset ID is required." });
        }

        const asset = await IndividualAsset.findById(individualAssetId).populate("assetTypeId locationId");
        if (!asset) {
            return res.status(404).json({ success: false, message: "Individual asset not found." });
        }

        if (req.user.role === "labIncharge") {
            if (asset.locationId._id.toString() !== req.user.locationId.toString()) {
                return res.status(403).json({ success : false, message: "Lab Incharge can access only their location's assets." });
            }
        }


        return res.status(200).json({ success: true, data: asset });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch individual asset." });
    }
};

// UPDATE SINGLE ASSET
export const updateIndividualAsset = async (req, res) => {
    try {
        const { individualAssetId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(individualAssetId)) {
            return res.status(400).json({ success: false, message: "Valid asset ID is required." });
        }

        const { error, value } = updateIndividualAssetSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const asset = await IndividualAsset.findById(individualAssetId).populate("assetTypeId locationId");

        if (!asset) {
            return res.status(404).json({ success: false, message: "Individual asset not found." });
        }

        // If location or status is updated, enforce rule
        if (value.status || value.locationId) {
            return res.status(400).json({
                message: "Use movement module to change status or location"
            });
        }



        const updatedAsset = await IndividualAsset.findByIdAndUpdate(individualAssetId, value, { new: true, runValidators: true }).populate("locationId");
        if (!updatedAsset) {
            return res.status(404).json({ success: false, message: "Individual asset not found or update failed" });
        }

        return res.status(200).json({ success: true, message: "Asset updated successfully.", data: updatedAsset });
    } catch (error) {
        console.error(error);
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: "Please send valid data as per guidelines." });
        }
        return res.status(500).json({ success: false, message: "Failed to update individual asset." });
    }
};

// DELETE SINGLE ASSET
export const deleteIndividualAsset = async (req, res) => {
    try {
        const { individualAssetId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(individualAssetId)) {
            return res.status(400).json({ success: false, message: "Valid asset ID is required." });
        }

        const deletedAsset = await IndividualAsset.findByIdAndDelete(individualAssetId);
        if (!deletedAsset) {
            return res.status(404).json({ success: false, message: "Individual asset not found or delete failed." });
        }

        return res.status(200).json({ success: true, message: "Individual asset deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to delete individual asset." });
    }
};


export const getAssetSummary = async (req, res) => {
    try {

        let locationId;

        // Joi validation (ONLY for query params)
        const { error, value } = getAssetSummaryQuerySchema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        if(req.user.role === "admin"){
            if(value.locationId){
                locationId = value.locationId;
            }
        }

        if(req.user.role === "labIncharge"){
            locationId = req.user.locationId;
        }

        const matchStage = {
            status: { $ne: "discarded" }
        };

        if (locationId) {
        matchStage.locationId = new mongoose.Types.ObjectId(locationId);
        }

        const pipeline = [
        { $match: matchStage },

        // join asset type
        {
            $lookup: {
            from: "assettypes",
            localField: "assetTypeId",
            foreignField: "_id",
            as: "assetType"
            }
        },
        { $unwind: "$assetType" },

        // join location
        {
            $lookup: {
            from: "locations",
            localField: "locationId",
            foreignField: "_id",
            as: "location"
            }
        },
        { $unwind: "$location" },
        ];

        // GROUPING LOGIC CHANGES HERE
        if (locationId) {
        // ONE location → group by asset type only
        pipeline.push({
            $group: {
            _id: "$assetType._id",
            assetName: { $first: "$assetType.name" },
            configuration: { $first: "$assetType.configuration" },
            quantity: { $sum: 1 }
            }
        });

        pipeline.push({
            $project: {
            _id: 0,
            assetTypeId: "$_id",
            assetName: 1,
            configuration: 1,
            quantity: 1
            }
        });
        } else {
        // ALL locations → group by asset type + location
        pipeline.push({
            $group: {
            _id: {
                assetTypeId: "$assetType._id",
                locationId: "$location._id"
            },
            assetName: { $first: "$assetType.name" },
            configuration: { $first: "$assetType.configuration" },
            locationName: { $first: "$location.name" },
            locationType: { $first: "$location.type" },
            quantity: { $sum: 1 }
            }
        });

        pipeline.push({
            $project: {
            _id: 0,
            assetTypeId: "$_id.assetTypeId",
            locationId: "$_id.locationId",
            assetName: 1,
            configuration: 1,
            locationName: 1,
            locationType: 1,
            quantity: 1
            }
        });
        }

        pipeline.push({
        $sort: { assetName: 1 }
        });

        const summary = await IndividualAsset.aggregate(pipeline);

        return res.status(200).json({
        success: true,
        count: summary.length,
        data: summary
        });

    } catch (error) {
        console.error("Asset summary error:", error);
        return res.status(500).json({
        success: false,
        message: "Failed to fetch asset summary"
        });
    }
};


