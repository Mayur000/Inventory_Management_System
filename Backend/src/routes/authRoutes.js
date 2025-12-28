import {Router} from "express"
import { registerUser, login , logoutUser ,getCurrentUser,refreshAccessToken } from "../controllers/authController.js"    
import { validate } from "../middleware/validaterMiddleware.js";   
import { userRegisterValidator } from "../validators/registerValidation.js";
import { userLoginValidator } from "../validators/loginValidation.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router()
router
    .route("/register")
    .post(userRegisterValidator(),validate,registerUser);

router
    .route("/login")
    .post(userLoginValidator(),validate,login)

router
    .route("/logout")
    .post(verifyJWT,logoutUser)

router
  .route("/me")
  .get(verifyJWT, getCurrentUser);  

router
  .route("/refresh")
  .post(refreshAccessToken);  

export default router;
