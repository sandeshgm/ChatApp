const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const friendRequestValidate = [
  body("receiverId").notEmpty().withMessage("Receiver ID is required"),
  validate,
];

module.exports = friendRequestValidate;
