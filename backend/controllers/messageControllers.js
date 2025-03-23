const Message = require("../Models/messageModels");
const Conversation = require("../Models/conversationModels");
const Group = require("../Models/groupModel");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, groupId, message } = req.body;

    if (!senderId || (!receiverId && !groupId) || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if conversation exists, if not, create one
    let conversation = null;

    if (receiverId) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, receiverId],
        });
        await conversation.save();
      }
    }

    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      if (!group.members.includes(senderId)) {
        return res.status(403).json({
          message: "You are not a member of this group",
        });
      }
    }
    // Save the message
    const newMessage = new Message({
      senderId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      message,
      conversationId: conversation ? conversation._id : null,
    });

    await newMessage.save();

    // Add message to conversation
    if (conversation) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).populate(
      "senderId",
      "username profilePic"
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { sendMessage, getMessages };
