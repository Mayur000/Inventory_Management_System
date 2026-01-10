import Joi from "joi";


//Create Asset Type Validation
export const createAssetTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    configuration: Joi.string().trim().required(),

    rate: Joi.number().positive().required(),
    minQuantity: Joi.number().positive().min(1).required(),

    totalQuantityBought: Joi.number().integer().min(0).required(),

    totalCost: Joi.number().min(0).required(),

    billNo: Joi.string().trim().required(),

    DPRno: Joi.string().trim().required(),
}).required().options({
    stripUnknown : true,
    convert :true,
    abortEarly : false
});



//Update Asset Type Validation
//(All fields optional, but at least one must be present)
export const updateAssetTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),

    configuration: Joi.string().trim().optional(),

    minQuantity: Joi.number().positive().min(1).optional(),

}).required().min(1).options({
    stripUnknown : true,
    convert :true,
    abortEarly : false
});


export const getAllAssetTypesQuerySchema = Joi.object({
    
    search: Joi.string().trim().optional(),
    
    name: Joi.string().trim().optional(),
    configuration: Joi.string().trim().optional(),
    billNo: Joi.string().trim().optional(),
    DPRno: Joi.string().trim().optional(),

    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
});