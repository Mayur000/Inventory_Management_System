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
    assetTypeId: Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation"),
    locationId: Joi.string().trim().required().custom(objectIdValidator, "ObjectId Validation"),
    serialNumber: Joi.string().trim().required(),
    status: Joi.string().trim().valid("inUse", "discarded", "inStock").optional()
}).options({ stripUnknown: true });

// UPDATE SCHEMA
// Status & locationId are intentionally NOT included
export const updateIndividualAssetSchema = Joi.object({
    serialNumber: Joi.string().trim().optional()
    // you can add other metadata fields here later
}).options({ stripUnknown: true });

export const getAssetSummaryQuerySchema = Joi.object({
    locationId: Joi.string().trim()
        .custom(objectIdValidator, "ObjectId validation")
        .optional()
}).options({
    stripUnknown: true,   // prevents $ne, $gt, regex injection
    abortEarly: true
});

export const getAllIndividualAssetsQuerySchema = Joi.object({
    assetTypeId: Joi.string().trim()
        .custom(objectIdValidator, "ObjectId validation")
        .optional(),

    locationId: Joi.string().trim()
        .custom(objectIdValidator, "ObjectId validation")
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
    abortEarly: true
});



