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

const router = express.Router();

// CREATE SINGLE ASSET --admin or labAssistant only
router.post("/", createIndividualAsset);

// GET ALL ASSETS --admin or labAssistant only
router.get("/", getAllIndividualAssets);

// get inventory like asset summary -- roles = admin or labIncharge
router.get( "/asset-summary", getAssetSummary );

// GET SINGLE ASSET BY ID --admin or labAssistant only
router.get("/:individualAssetId", getIndividualAssetById);

// UPDATE SINGLE ASSET (other than status/location) --admin or labAssistant only
router.put("/:individualAssetId", updateIndividualAsset);

// DELETE SINGLE ASSET --admin or labAssistant only
router.delete("/:individualAssetId", deleteIndividualAsset);



export default router;
