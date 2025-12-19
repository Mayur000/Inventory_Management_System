// routes/individualAssetRoutes.js
import express from "express";
import {
    createIndividualAsset,
    getAllIndividualAssets,
    getIndividualAssetById,
    updateIndividualAsset,
    deleteIndividualAsset
} from "../controllers/individualAssetController.js";

const router = express.Router();

// CREATE SINGLE ASSET
router.post("/", createIndividualAsset);

// GET ALL ASSETS
router.get("/", getAllIndividualAssets);

// GET SINGLE ASSET BY ID
router.get("/:individualAssetId", getIndividualAssetById);

// UPDATE SINGLE ASSET (other than status/location)
router.put("/:individualAssetId", updateIndividualAsset);

// DELETE SINGLE ASSET
router.delete("/:individualAssetId", deleteIndividualAsset);

export default router;
