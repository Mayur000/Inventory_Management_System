import { Router } from "express";
import {
  createTransfer,
  getAllMovements,
  getMovementById,
  getAssetHistory,
  getLocationMovements
} from "../controllers/movementController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validaterMiddleware.js";
import { createMovementValidator } from "../validators/movementValidator.js";

const router = Router();

// All movement routes require authentication
router.use(verifyJWT);

// Create transfer (Lab Assistant and Admin only)
router
  .route("/")
  .post(
    roleMiddleware(["admin", "labAssistant"]),  
    createMovementValidator(),
    validate,
    createTransfer
  )
  .get(
    roleMiddleware(["admin", "labAssistant", "labIncharge"]),  
    getAllMovements
  );

// Get specific movement 
router
  .route("/:id")
  .get(
    roleMiddleware(["admin", "labAssistant", "labIncharge"]),
    getMovementById
  );

// Get asset history 
router
  .route("/asset/:assetId/history")
  .get(
    roleMiddleware(["admin", "labAssistant", "labIncharge"]),
    getAssetHistory
  );

// Get location movements 
router
  .route("/location/:locationId")
  .get(
    roleMiddleware(["admin", "labAssistant", "labIncharge"]),
    getLocationMovements
  );

export default router;