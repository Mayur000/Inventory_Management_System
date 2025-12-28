import { body } from "express-validator";

const createLocationValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Location name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Location name must be between 2 and 100 characters"),

    body("type")
      .notEmpty()
      .withMessage("Location type is required")
      .isIn(["lab", "mainStore", "stock", "room", "scrap"])
      .withMessage("Invalid location type"),

    body("locationInchargeId")
      .optional()
      .isMongoId()
      .withMessage("Invalid incharge ID format")
  ];
};

export { createLocationValidator };