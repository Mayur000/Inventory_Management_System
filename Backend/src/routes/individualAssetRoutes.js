// routes/individualAssetRoutes.js
import express from "express";
import {
    createIndividualAsset,
    getAllIndividualAssets,
    getIndividualAssetById,
    updateIndividualAsset,
    deleteIndividualAsset,
    getAssetSummary
} from "../controllers/individualAssetController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// all location routes require authentication
router.use(verifyJWT);


// CREATE SINGLE ASSET --admin or labAssistant only
router.post("/", roleMiddleware(["admin", "labAssistant"]),createIndividualAsset);

// GET ALL ASSETS --public
router.get("/", getAllIndividualAssets);

// get inventory like asset summary -- roles = admin or labIncharge --labAssistant ko access dena hain kya ask HOD sir in next meeting
router.get( "/asset-summary", roleMiddleware(["admin", "labIncharge"]), getAssetSummary );

// GET SINGLE ASSET BY ID --public
router.get("/:individualAssetId", getIndividualAssetById);

// UPDATE SINGLE ASSET (other than status/location) --admin or labAssistant only
router.put("/:individualAssetId", roleMiddleware(["admin", "labAssistant"]), updateIndividualAsset);

// DELETE SINGLE ASSET --admin or labAssistant only
router.delete("/:individualAssetId", roleMiddleware(["admin", "labAssistant"]), deleteIndividualAsset);



export default router;
