import express from "express";
import {
	createAssetType,
	getAllAssetTypes,
	getAssetTypeById,
	updateAssetType,
	deleteAssetType,
} from "../controllers/assetTypeController.js";

const router = express.Router();

// CREATE
// POST /api/asset-types
router.post("/", createAssetType);

// READ (ALL)
// GET /api/asset-types
router.get("/", getAllAssetTypes);

// READ (ONE)
// GET /api/asset-types/:assetTypeId
router.get("/:assetTypeId", getAssetTypeById);

// UPDATE
// PUT /api/asset-types/:assetTypeId
router.put("/:assetTypeId", updateAssetType);

// DELETE
// DELETE /api/asset-types/:assetTypeId
router.delete("/:assetTypeId", deleteAssetType);

export default router;
