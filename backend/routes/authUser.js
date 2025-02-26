const express = require("express");
const {userRegister,userLogin, userLogOut} = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logOut", userLogOut);

module.exports = router;
