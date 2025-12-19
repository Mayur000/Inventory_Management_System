import mongoose from "mongoose";
import AssetType from "../models/AssetType.js";
import { createAssetTypeSchema, updateAssetTypeSchema } from "../validators/assetTypeValidation.js";

//Create a new Asset Type
//POST /api/asset-types
export const createAssetType = async (req, res) => {
	try {
		const {error, value} = createAssetTypeSchema.validate(req.body);

		if (error) {
			return res.status(400).json({ success: false, message: error.details[0].message, });
		}

		const assetType = await AssetType.create(value);

		return res.status(201).json({ success: true, message: "Asset type created successfully", data: assetType, });
	} catch (error) {
		console.error( "Error in createAssetType controller : " ,error);
		return res.status(500).json({ success: false, message: "Failed to create asset type."});
	}
};

// Get all Asset Types
// GET /api/asset-types
export const getAllAssetTypes = async (req, res) => {
	try {
		const assetTypes = await AssetType.find();

		return res.status(200).json({ success: true, count: assetTypes.length, data: assetTypes, });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Failed to fetch asset types", });
	}
};


//Get single Asset Type by ID
//GET /api/asset-types/:id
export const getAssetTypeById = async (req, res) => {
	try {
		if(!req.params.assetTypeId || !mongoose.Types.ObjectId.isValid(req.params.assetTypeId)){
			return res.status(400).json({success : false, message : "Valida Asset type Id is required."});
		}
		const assetType = await AssetType.findById(req.params.assetTypeId);

		if (!assetType) {
			return res.status(404).json({ success: false, message: "Asset type not found", });
		}

		return res.status(200).json({ success: true, data: assetType, });
	} catch (error) {

		console.error(error);
		return res.status(500).json({ success: false, message: "Failed to fetch asset type", });
	}
};


//Update Asset Type
//PUT /api/asset-types/:id
export const updateAssetType = async (req, res) => {

	try {
		if(!req.params.assetTypeId || !mongoose.Types.ObjectId.isValid(req.params.assetTypeId)){
			return res.status(400).json({success : false, message : "Valida Asset type Id is required."});
		}
		const {error , value} = updateAssetTypeSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ success: false, message: error.details[0].message, });
		}
		const updatedAssetType = await AssetType.findByIdAndUpdate(
			req.params.assetTypeId,
			value,
			//check why these parameters and are they required
			{ new: true, runValidators: true }
		);

		if (!updatedAssetType) {
			return res.status(404).json({ success: false, message: "Asset type not found or Some error occurred.", });
		}

		return res.status(200).json({ success: true, message: "Asset type updated successfully", data: updatedAssetType, });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Failed to update asset type", });
	}
};


// Delete Asset Type
// DELETE /api/asset-types/:id
export const deleteAssetType = async (req, res) => {
	try {

		if(!req.params.assetTypeId || !mongoose.Types.ObjectId.isValid(req.params.assetTypeId)){
			return res.status(400).json({success : false, message : "Valida Asset type Id is required."});
		}

		const deletedAssetType = await AssetType.findByIdAndDelete(req.params.assetTypeId);

		if (!deletedAssetType) {
			return res.status(404).json({ success: false, message: "Asset type not found or Some error occurred.", });
		}

		return res.status(200).json({ success: true, message: "Asset type deleted successfully",});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, message: "Failed to delete asset type",});
	}
};
