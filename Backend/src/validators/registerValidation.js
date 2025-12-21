import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name should not be empty"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn([
        "admin",
        "labAssistant",
        "labIncharge",
        "practicalIncharge"
      ])
      .withMessage("Invalid role")
  ];
};

export { userRegisterValidator };
