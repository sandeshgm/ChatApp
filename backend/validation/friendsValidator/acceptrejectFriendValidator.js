const { body } = require("express-validator");
const validate = require("../../middleware/validator.middleware");

const acceptRejectFriendValidate = [
  body("requestId").notEmpty().withMessage("Request ID is required"),
  body("action").isIn(["accept", "reject"]).withMessage("Action must be 'accept' or 'reject'"),
  validate,
];

module.exports = acceptRejectFriendValidate;
