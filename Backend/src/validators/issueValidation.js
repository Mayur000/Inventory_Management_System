import Joi from "joi";
import mongoose from "mongoose";

// Validate ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};


// Create Issue Validation
export const createIssueSchema = Joi.object({
  locationId: Joi.string().trim().custom(objectIdValidator).required(),
  individualAssetIds: Joi.array().items(objectIdValidator).min(1).required(),
  status: Joi.string().trim().valid("created", "inProgress", "solved").optional(),
  reason: Joi.string().trim().min(5).max(500).required(),
  title: Joi.string().trim().min(5).max(500).required(),
}).options({
    stripUnknown: true,   
    abortEarly: false,
    convert : true,
});

// Update Issue Validation
export const updateIssueSchema = Joi.object({
  // Only status and reason can be updated
  status: Joi.string().trim().valid("created", "inProgress", "solved").optional(),
  reason: Joi.string().trim().min(5).max(500).optional(),
  title: Joi.string().trim().min(5).max(500).optional(),
}).min(1).options({
    stripUnknown: true,   
    abortEarly: false,
    convert : true,
});


export const getAllIssuesQuerySchema = Joi.object({
    status: Joi.string().trim().valid("created", "inProgress", "solved").optional(),
    locationId: Joi.string().trim().custom(objectIdValidator).optional(),
    search: Joi.string().trim().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50)
}).options({ stripUnknown: true, abortEarly: false, convert : true });