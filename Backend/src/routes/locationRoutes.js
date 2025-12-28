import { Router } from "express";
import {
  createLocation,
  getAllLocations,
  getLocationById,
//   getLocationInventory,
  assignIncharge,
  removeIncharge
} from "../controllers/locationController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validaterMiddleware.js";
import { createLocationValidator } from "../validators/locationValidation.js";

const router = Router();

// all location routes require authentication
router.use(verifyJWT);

// create location (admin only)
router
  .route("/")
  .post(
    roleMiddleware(["admin"]),
    createLocationValidator(),
    validate,
    createLocation
  )
  .get(getAllLocations);  // all authenticated users can view

// get specific location
router
  .route("/:id")
  .get(getLocationById);

// get location inventory (for future use)
// router
//   .route("/:id/inventory")
//   .get(getLocationInventory);

// assign/change incharge (admin only)
router
  .route("/:locationId/assign-incharge")
  .put(
    roleMiddleware(["admin"]),
    assignIncharge
  );

// remove incharge (admin only)
router
  .route("/:locationId/remove-incharge")
  .delete(
    roleMiddleware(["admin"]),
    removeIncharge
  );

export default router;