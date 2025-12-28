import { body } from "express-validator";

const userLoginValidator = () => {
  return [
    // ✅ CORRECT
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),

    ,
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

export { userLoginValidator };
