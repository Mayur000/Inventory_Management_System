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
    assetTypeId: Joi.string().required().custom(objectIdValidator, "ObjectId Validation"),
    locationId: Joi.string().required().custom(objectIdValidator, "ObjectId Validation"),
    serialNumber: Joi.string().required(),
    status: Joi.string().valid("inUse", "discarded", "inStock").optional()
}).options({ stripUnknown: true });

// UPDATE SCHEMA
// Status & locationId are intentionally NOT included
export const updateIndividualAssetSchema = Joi.object({
    serialNumber: Joi.string().optional()
    // you can add other metadata fields here later
}).options({ stripUnknown: true });


