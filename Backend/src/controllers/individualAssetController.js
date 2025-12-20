import mongoose from "mongoose";
import IndividualAsset from "../models/IndividualAsset.js";
import Location from "../models/Location.js"
import AssetType from "../models/AssetType.js";
import { createIndividualAssetSchema, updateIndividualAssetSchema } from "../validators/individualAssetValidation.js";

// CREATE SINGLE ASSET
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
        if (value.status === "discarded" && locationExists.type !== "scrap" || value.status === "inStock" && locationExists.type !== "stock") {
            return res.status(400).json({
                success: false,
                message: "Discarded assets must be stored in scrap location, and In Stock assets must be stored in stock location."
            });
        }


        if (value.status === "Discarded" && locationExists.type !== "scrap") {
    return res.status(400).json({
        success: false,
        message: "Discarded assets must be stored in scrap location."
    });
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
        const { assetTypeId, locationId, status, page = 1, limit = 50 } = req.query;

        if (assetTypeId && !mongoose.Types.ObjectId.isValid(assetTypeId)) {
            return res.status(400).json({ success: false, message: "Invalid assetTypeId" });
        }
        if (locationId && !mongoose.Types.ObjectId.isValid(locationId)) {
            return res.status(400).json({ success: false, message: "Invalid locationId" });
        }

        const filter = {};
        if (assetTypeId) filter.assetTypeId = assetTypeId;
        if (locationId) filter.locationId = locationId;
        if (status) filter.status = status;

        const assets = await IndividualAsset.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("assetTypeId locationId");

        const total = await IndividualAsset.countDocuments(filter);

        return res.status(200).json({ success: true, count: total, data: assets });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch individual assets." });
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

