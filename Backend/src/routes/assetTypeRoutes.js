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
// GET /api/asset-types/:id
router.get("/:id", getAssetTypeById);

// UPDATE
// PUT /api/asset-types/:id
router.put("/:id", updateAssetType);

// DELETE
// DELETE /api/asset-types/:id
router.delete("/:id", deleteAssetType);

export default router;
