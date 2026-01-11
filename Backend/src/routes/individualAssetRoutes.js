// routes/individualAssetRoutes.js
import express from "express";
import {
    createIndividualAsset,
    getAllIndividualAssets,
    getIndividualAssetById,
    updateIndividualAsset,
    deleteIndividualAsset,
    getAssetSummary,
    getLocationAssetSummary,
    getAssetDistribution
} from "../controllers/individualAssetController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// all location routes require authentication
router.use(verifyJWT);


// CREATE SINGLE ASSET --admin or labAssistant only
router.post("/", roleMiddleware(["admin", "labAssistant"]),createIndividualAsset);

// GET ALL ASSETS --all authenticated users
router.get("/",  roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getAllIndividualAssets);

// get inventory like asset summary -- roles = admin or labIncharge --labAssistant ko access dena hain kya ask HOD sir in next meeting
// router.get( "/asset-summary", roleMiddleware(["admin", "labIncharge", "labAssistant"]), getAssetSummary );

// location centric view
// in this locationId = xyz in query, what are the assets present in what quantity
// IMPORTANT - for labIncharge location is automatically taken from server side so no need to send location in req.query
router.get( "/location-summary", roleMiddleware(["admin", "labIncharge", "labAssistant"]), getLocationAssetSummary );

// asset centric view
// for this assetTypeId = xyz in query, in what all location in what quantity this asset type  is present
router.get( "/asset-distribution", roleMiddleware(["admin", "labIncharge", "labAssistant"]), getAssetDistribution );


// GET SINGLE ASSET BY ID --all authenticated users
router.get("/:individualAssetId",  roleMiddleware(["admin", "labAssistant", "practicalIncharge", "labIncharge"]), getIndividualAssetById);

// UPDATE SINGLE ASSET (other than status/location) --admin or labAssistant only
router.put("/:individualAssetId", roleMiddleware(["admin", "labAssistant"]), updateIndividualAsset);

// DELETE SINGLE ASSET --admin or labIncharge or labAssistant only
router.delete("/:individualAssetId", roleMiddleware(["admin", "labAssistant",]), deleteIndividualAsset);



export default router;
