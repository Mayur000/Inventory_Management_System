import { body } from "express-validator";

const userLoginValidator = () => {
  return [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email is not valid"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

export { userLoginValidator };