import Joi from "joi";
import mongoose from "mongoose";

// Helper to validate ObjectId
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

// CREATE SCHEMA
export const createIndividualAssetSchema = Joi.object({
    assetTypeId: Joi.string().trim().required().custom(objectIdValidator),
    locationId: Joi.string().trim().required().custom(objectIdValidator),
    serialNumber: Joi.string().trim().required(),
    // status: Joi.string().trim().valid("inUse", "discarded", "inStock").optional()
}).options({ stripUnknown: true, convert : true, abortEarly : false });

// UPDATE SCHEMA
// Status & locationId are intentionally NOT included --as they cannot be updated --can only be changed thorugh movement
export const updateIndividualAssetSchema = Joi.object({
    serialNumber: Joi.string().trim().optional()
}).options({ stripUnknown: true });

export const getAssetSummaryQuerySchema = Joi.object({
    locationId: Joi.string().trim()
        .custom(objectIdValidator)
        .optional()
}).options({
    stripUnknown: true,   // prevents $ne, $gt, regex injection
    abortEarly: false
});

export const getAllIndividualAssetsQuerySchema = Joi.object({
    
    search: Joi.string().trim().optional(),

    assetTypeId: Joi.string().trim()
        .custom(objectIdValidator)
        .optional(),

    locationId: Joi.string().trim()
        .custom(objectIdValidator)
        .optional(),

    status: Joi.string().trim()
        .valid("inUse", "discarded", "inStock")
        .optional(),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50)
}).options({
    stripUnknown: true,   // removes injected keys like $ne, $gt
    abortEarly: false
});




export const locationSummaryQuerySchema = Joi.object({
    //locationId is optional and not required --because for role=labIncharge we are not taking locationId from req.query, hence for role=labInchagre no need to send in query, hence it has tobe kept as optional
  locationId: Joi.string().trim().custom(objectIdValidator).optional(),
  assetTypeId: Joi.string().trim().custom(objectIdValidator).optional(),
  status: Joi.string().optional(),

  search: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
}).options({ stripUnknown: true });

export const assetDistributionQuerySchema = Joi.object({
  assetTypeId: Joi.string().trim().custom(objectIdValidator).optional(),
  status: Joi.string().optional(),

  search: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
}).options({ stripUnknown: true });
