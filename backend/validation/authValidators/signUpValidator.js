const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const signUpValidate = [
  body("fullname")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters."),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 6 characters long."),
  validate,
];

module.exports = signUpValidate;
