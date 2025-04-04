const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:conversationId", getMessages);

module.exports = router;
