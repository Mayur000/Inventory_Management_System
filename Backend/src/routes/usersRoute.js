import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  reactivateUser,
  assignLocationToUser,
  changeUserPassword
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validaterMiddleware.js";
import { createUserValidator, updateUserValidator } from "../validators/userValidation.js";

const router = Router();

// ✅ All user routes require authentication and admin role
router.use(verifyJWT);
router.use(roleMiddleware(["admin"]));

// Create and get all users
router
  .route("/")
  .post(createUserValidator(), validate, createUser)
  .get(getAllUsers);

// Get, update, delete specific user
router
  .route("/:id")
  .get(getUserById)
  .put(updateUserValidator(), validate, updateUser)
  .delete(deleteUser);

// Reactivate user
router
  .route("/:id/reactivate")
  .put(reactivateUser);

// Assign location
router
  .route("/:userId/assign-location")
  .put(assignLocationToUser);

// Change user password
router
  .route("/:userId/change-password")
  .put(changeUserPassword);

export default router;