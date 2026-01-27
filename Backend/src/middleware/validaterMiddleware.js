import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  //if no errors, move to next middleware
  if (errors.isEmpty()) {
    return next();
  }

  //extract error messages
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  //throw custom API error
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};