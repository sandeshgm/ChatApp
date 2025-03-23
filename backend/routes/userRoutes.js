const express = require("express");
const { getUserDetails, searchUsers } = require("../controllers/userControllers");

const router = express.Router();

router.get("/:userId", getUserDetails);
router.get("/search/:query", searchUsers); 

module.exports = router;
