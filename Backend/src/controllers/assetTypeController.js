import mongoose from "mongoose";
import AssetType from "../models/AssetType.js";
import { createAssetTypeSchema, updateAssetTypeSchema, getAllAssetTypesQuerySchema } from "../validators/assetTypeValidation.js";

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");


//Create a new Asset Type
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
		//Mongoose validation error (runValidators) -- for create() and save() methods runValidators run automatically behind the scenes.
		if (error.name === "ValidationError") {
			return res.status(400).json({ success: false, message: "Please send valid data as mentioned in the guildelines."});
		}
		return res.status(500).json({ success: false, message: "Failed to create asset type."});
	}
};

// Get all Asset Types
//add validations for all filter and alos prevent regex  or nosql injection which can happpen through req.pparams
export const getAllAssetTypes = async (req, res) => {
	try {
		// Validate query params
		const { error, value } = getAllAssetTypesQuerySchema.validate(req.query);
		if (error) {
		return res
			.status(400)
			.json({ success: false, message: error.details[0].message });
		}

		const { search, name, configuration, page, limit } = value;

		const filter = {};

		// Simple filters (dropdowns / exact fields)
		if (name) {
		filter.name = new RegExp(escapeRegex(name), "i");
		}

		if (configuration) {
		filter.configuration = new RegExp(escapeRegex(configuration), "i");
		}

		// Global search (single input)
		if (search) {
		const safeSearch = escapeRegex(search);
		const regex = new RegExp(safeSearch, "i");

		filter.$or = [
			{ name: regex },
			{ configuration: regex },
			{ billNo: regex },
			{ DPRno: regex },
		];
		}

		// Pagination
		const assetTypes = await AssetType.find(filter)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(limit)
		.lean();

		const total = await AssetType.countDocuments(filter);

		return res.status(200).json({
		success: true,
		count: assetTypes.length,
		total,
		currentPage: page,
		totalPages: Math.ceil(total / limit),
		data: assetTypes,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
		success: false,
		message: "Failed to fetch asset types",
		});
	}
};

//Get single Asset Type by ID
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
			//new : true sends the updated object, reunValidators : true runs the schema level validators provided my mongoose --eg: min=0, max=100 or something like that before saving into DB
			{ new: true, runValidators: true }
		);

		if (!updatedAssetType) {
			return res.status(404).json({ success: false, message: "Asset type not found or Some error occurred.", });
		}

		return res.status(200).json({ success: true, message: "Asset type updated successfully", data: updatedAssetType, });
	} catch (error) {
		console.error(error);

		//Mongoose validation error (runValidators)
		if (error.name === "ValidationError") {
			return res.status(400).json({ success: false, message: "Please send valid data as mentioned in the guildelines."});
		}
		return res.status(500).json({ success: false, message: "Failed to update asset type", });
	}
};


// Delete Asset Type
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
