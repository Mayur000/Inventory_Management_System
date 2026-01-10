import { ApiError } from "../utils/ApiError.js";

// Check if user has required role
export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      // throw new ApiError(401, "Unauthorized - No user found");
      return res.status(401).json({success:false, message: "Unauthorized - No user found"});
    }

    if (!allowedRoles.includes(req.user.role)) {
      // throw new ApiError( 403, `Access denied. Required roles: ${allowedRoles.join(", ")}` );
      return res.status(403).json({success:false, message: `Access denied. Only these roles are allowed: ${allowedRoles.join(", ")}`});
    }

    next();
  };
};