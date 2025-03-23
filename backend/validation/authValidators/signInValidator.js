const { body } = require("express-validator");

const validate = require("../../middleware/validator.middleware");

const signInValidate = [
  body("email").notEmpty().withMessage("Please enter your email address"),
  body("password").notEmpty().withMessage("Password is required!"),
  validate,
];

module.exports = signInValidate;
