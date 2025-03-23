const Conversation = require("../Models/conversationModels");
const Message = require("../Models/messageModels");
const User = require("../Models/userModels");

// Create a new conversation (only if it doesn’t exist)
const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Both sender and receiver are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });

      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all conversations of a user
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username profilePic")
      .populate({
        path: "messages",
        select: "message senderId createdAt",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Get the latest message
      });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get messages in a conversation
const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a conversation (optional)
const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Conversation.findByIdAndDelete(conversationId);
    await Message.deleteMany({ conversationId });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  deleteConversation,
};
