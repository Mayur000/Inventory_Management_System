import Joi from "joi";
import mongoose from "mongoose";

// Validate ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

// Create Issue Validation
export const createIssueSchema = Joi.object({
  locationId: objectId.required(),
  individualAssetIds: Joi.array().items(objectId).min(1).required(),
  createdBy: objectId.required(),
  status: Joi.string().valid("created", "inProgress", "solved").optional(),
  reason: Joi.string().min(5).max(500).required(),
});

// Update Issue Validation
export const updateIssueSchema = Joi.object({
  // Only status and reason can be updated
  status: Joi.string().valid("created", "inProgress", "solved").optional(),
  reason: Joi.string().min(5).max(500).optional(),
}).min(1); // At least one field required
