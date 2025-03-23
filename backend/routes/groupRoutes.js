const express = require("express");
const { 
  createGroup, 
  joinGroup, 
  leaveGroup, 
  sendGroupMessage, 
  getGroupMessages, 
  removeMember, 
  deleteGroup 
} = require("../controllers/groupControllers");

const router = express.Router();

router.post("/create", createGroup);  
router.post("/join", joinGroup);  
router.post("/leave", leaveGroup);  
router.post("/sendMessage", sendGroupMessage); 
router.get("/message/:groupId", getGroupMessages); 
router.post("/removeMember", removeMember); 
router.post("/delete", deleteGroup); 

module.exports = router;
