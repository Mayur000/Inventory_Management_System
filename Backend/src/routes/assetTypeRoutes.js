import express from "express"
import {
	createAssetType,
	getAllAssetTypes,
	getAssetTypeById,
	updateAssetType,
	deleteAssetType,
} from "../controllers/assetTypeController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// all location routes require authentication
router.use(verifyJWT);

// CREATE --admin or labAssistant
router.post("/",  roleMiddleware(["admin", "labAssistant"]), createAssetType);

// READ (ALL) --all authenticated users
router.get("/",  roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getAllAssetTypes);

// READ (ONE) --all authenticated users
router.get("/:assetTypeId",  roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getAssetTypeById);

// UPDATE --admin or labAssistant
router.put("/:assetTypeId",  roleMiddleware(["admin", "labAssistant"]),updateAssetType);

// DELETE --admin or labAssistant
router.delete("/:assetTypeId", roleMiddleware(["admin", "labAssistant"]), deleteAssetType);

export default router;
