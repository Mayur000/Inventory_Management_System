import { body } from "express-validator";

const createMovementValidator = () => {
  return [
    body("individualAssetIds")
      .isArray({ min: 1 })
      .withMessage("At least one asset must be selected")
      .custom((value) => {
        if (!value.every((id) => typeof id === "string")) {
          throw new Error("All asset IDs must be valid");
        }
        return true;
      }),

    body("fromLocationId")
      .notEmpty()
      .withMessage("From location is required")
      .isMongoId()
      .withMessage("Invalid from location ID"),

    body("toLocationId")
      .notEmpty()
      .withMessage("To location is required")
      .isMongoId()
      .withMessage("Invalid to location ID"),

    body("actionType")
      .notEmpty()
      .withMessage("Action type is required")
      .isIn(["transfer", "discard"])
      .withMessage("Invalid action type"),

    body("remark")
      .optional()
      .isString()
      .withMessage("Remark must be a string"),

    body("issues")
      .isArray({ min: 1 })
      .withMessage("At least one issue must be linked to the movement")
      .custom((value) => {
        if (!value.every((id) => typeof id === "string")) {
          throw new Error("All issue IDs must be valid");
        }
        return true;
      })
  ];
};

export { createMovementValidator };