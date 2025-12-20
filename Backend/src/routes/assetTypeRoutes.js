import express from "express";
import {
	createAssetType,
	getAllAssetTypes,
	getAssetTypeById,
	updateAssetType,
	deleteAssetType,
} from "../controllers/assetTypeController.js";

const router = express.Router();

// CREATE --admin or labAssistant
router.post("/", createAssetType);

// READ (ALL) --public
router.get("/", getAllAssetTypes);

// READ (ONE) --public
router.get("/:assetTypeId", getAssetTypeById);

// UPDATE --admin or labAssistant
router.put("/:assetTypeId", updateAssetType);

// DELETE --admin or labAssistant
router.delete("/:assetTypeId", deleteAssetType);

export default router;
