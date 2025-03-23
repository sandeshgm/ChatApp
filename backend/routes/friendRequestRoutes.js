const express = require("express");
const {sendFriendRequest,acceptFriendRequest,rejectFriendRequest,getFriendRequests,getFriendsList} = require("../controllers/friendRequestControllers")

const router = express.Router();

router.post("/send",sendFriendRequest);
router.post("/accept",acceptFriendRequest);
router.post("/reject",rejectFriendRequest);
router.get("/requests/:userId",getFriendRequests);
router.get("/request-list/:userId",getFriendsList);

module.exports = router;
