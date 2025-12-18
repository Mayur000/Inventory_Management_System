import AssetType from "../models/AssetType.js";

/**
 * @desc    Create a new Asset Type
 * @route   POST /api/asset-types
 */
export const createAssetType = async (req, res) => {
	try {
		const assetType = await AssetType.create(req.body);

		return res.status(201).json({
			success: true,
			message: "Asset type created successfully",
			data: assetType,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to create asset type",
			error: error.message,
		});
	}
};

/**
 * @desc    Get all Asset Types
 * @route   GET /api/asset-types
 */
export const getAllAssetTypes = async (req, res) => {
	try {
		const assetTypes = await AssetType.find();

		return res.status(200).json({
			success: true,
			count: assetTypes.length,
			data: assetTypes,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch asset types",
			error: error.message,
		});
	}
};

/**
 * @desc    Get single Asset Type by ID
 * @route   GET /api/asset-types/:id
 */
export const getAssetTypeById = async (req, res) => {
	try {
		const assetType = await AssetType.findById(req.params.id);

		if (!assetType) {
			return res.status(404).json({
				success: false,
				message: "Asset type not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: assetType,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to fetch asset type",
			error: error.message,
		});
	}
};

/**
 * @desc    Update Asset Type
 * @route   PUT /api/asset-types/:id
 */
export const updateAssetType = async (req, res) => {
	try {
		const updatedAssetType = await AssetType.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		if (!updatedAssetType) {
			return res.status(404).json({
				success: false,
				message: "Asset type not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Asset type updated successfully",
			data: updatedAssetType,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to update asset type",
			error: error.message,
		});
	}
};

/**
 * @desc    Delete Asset Type
 * @route   DELETE /api/asset-types/:id
 */
export const deleteAssetType = async (req, res) => {
	try {
		const deletedAssetType = await AssetType.findByIdAndDelete(req.params.id);

		if (!deletedAssetType) {
			return res.status(404).json({
				success: false,
				message: "Asset type not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Asset type deleted successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to delete asset type",
			error: error.message,
		});
	}
};
