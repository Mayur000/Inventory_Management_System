import Joi from "joi";


//Create Asset Type Validation
export const createAssetTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    configuration: Joi.string().trim().required(),

    rate: Joi.number().positive().optional(),

    totalQuantityBought: Joi.number().integer().min(0).optional(),

    totalCost: Joi.number().min(0).optional(),

    billNo: Joi.string().trim().optional(),

    DPRno: Joi.string().trim().optional(),
}).options({
    stripUnknown : true,
    convert :true,
    abortEarly : false
});



//Update Asset Type Validation
//(All fields optional, but at least one must be present)
export const updateAssetTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),

    configuration: Joi.string().trim().optional(),

    rate: Joi.number().positive().optional(),

    totalQuantityBought: Joi.number().integer().min(0).optional(),

    totalCost: Joi.number().min(0).optional(),

    billNo: Joi.string().trim().optional(),

    DPRno: Joi.string().trim().optional(),
}).min(1).options({
    stripUnknown : true,
    convert :true,
    abortEarly : false
});
