const express = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriendsList,
} = require("../controllers/friendRequestControllers");
const friendRequestValidate = require("../validation/friendsValidator/friendRequestValidator");
const acceptRejectFriendValidate = require("../validation/friendsValidator/acceptrejectFriendValidator");

const router = express.Router();

router.post("/send", friendRequestValidate, sendFriendRequest);
router.post("/accept", acceptRejectFriendValidate, acceptFriendRequest);
router.post("/reject", acceptRejectFriendValidate, rejectFriendRequest);
router.get("/requests/:userId", getFriendRequests);
router.get("/request-list/:userId", getFriendsList);

module.exports = router;
