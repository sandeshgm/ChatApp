const express = require("express");
const {
  userRegister,
  userLogin,
  userLogOut,
} = require("../controllers/userControllers.js");
const signInValidate = require("../validation/authValidators/signInValidator.js");
const signUpValidate = require("../validation/authValidators/signUpValidator.js");
const router = express.Router();

router.post("/register", signUpValidate, userRegister);
router.post("/login", signInValidate, userLogin);
router.post("/logOut", userLogOut);

module.exports = router;
