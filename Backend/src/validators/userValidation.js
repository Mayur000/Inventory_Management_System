import { body } from "express-validator";

const createUserValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "labAssistant", "labIncharge", "practicalIncharge"])
      .withMessage("Invalid role"),

    body("assignedLocation")
      .optional()
      .isMongoId()
      .withMessage("Invalid location ID format")
  ];
};

const updateUserValidator = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),

    body("role")
      .optional()
      .isIn(["admin", "labAssistant", "labIncharge", "practicalIncharge"])
      .withMessage("Invalid role"),

    body("assignedLocation")
      .optional()
      .isMongoId()
      .withMessage("Invalid location ID format")
  ];
};

export { createUserValidator, updateUserValidator };