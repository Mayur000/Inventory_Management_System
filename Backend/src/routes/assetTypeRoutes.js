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

// DELETE --admin or labAssistant --maybe remove this because Hod sir said - "All hhistory should be maintained"
// HE said something like this so maybe dont delete at all
// Because if we delete Asset Type
//Then its corresposing individual Assets will be deleted
// if inidivdual aasset is deleted then its  corresponsing issues and movements will also be deleted
//So i have not yet implemented this cascadeDeletion
// Confirm with HOD sir
router.delete("/:assetTypeId", roleMiddleware(["admin", "labAssistant"]), deleteAssetType);

export default router;
