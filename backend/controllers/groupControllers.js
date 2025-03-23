const Group = require("../Models/groupModel");
const Message = require("../Models/messageModels");

const createGroup = async (req, res) => {
  try {
    const { name, adminId } = req.body;

    const groupExists = await Group.findOne({ name });
    if (groupExists)
      return res.status(400).json({ message: "Group name already exists" });

    const newGroup = new Group({ name, admin: adminId, members: [adminId] });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Joined group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    // Remove user from the group
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );

    // If the user is the admin, transfer admin role or delete group
    if (group.admin.toString() === userId) {
      if (group.members.length > 0) {
        group.admin = group.members[0]; // Assign new admin
      } else {
        await Group.findByIdAndDelete(groupId);
        return res
          .status(200)
          .json({ message: "Group deleted as no members left" });
      }
    }

    await group.save();
    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const sendGroupMessage = async (req, res) => {
  try {
    console.log("body :", req.body);
    const { groupId, userId, message } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    // Create a new message
    const newMessage = new Message({ groupId, senderId: userId, message });
    await newMessage.save();

    // Ensure group.messages exists and push new message
    if (!group.messages) group.messages = [];
    group.messages.push(newMessage._id);
    await group.save();

    console.log("Message saved successfully:", newMessage);
    res.status(200).json({ message: "Message sent", messageData: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// const sendDirectMessage = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);

//     const { senderId, receiverId, text } = req.body;

//     if (!senderId || !receiverId || !text) {
//       return res.status(400).json({ message: "senderId, receiverId, and text are required" });
//     }

//     const sender = await User.findById(senderId);
//     const receiver = await User.findById(receiverId);

//     if (!sender || !receiver) {
//       return res.status(404).json({ message: "Sender or Receiver not found" });
//     }

//     const newMessage = new Message({ senderId, receiverId, text });
//     await newMessage.save();

//     console.log("Message sent successfully:", newMessage);
//     res.status(200).json({ message: "Message sent", messageData: newMessage });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const getGroupMessages = async (req, res) => {
  try {
    console.log("request params", req.params);
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        message: "group id is required",
      });
    }

    const group = await Group.findById(groupId).populate({
      path: "messages",
      populate: {
        path: "senderId",
        model: "User",
        select: "username profilePic",
      },
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    console.log("Fetched Messages:", group.messages);
    res.status(200).json({ messages: group.messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const removeMember = async (req, res) => {
  try {
    const { groupId, adminId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId, adminId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId) {
      return res
        .status(403)
        .json({ message: "Only admin can delete the group" });
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  leaveGroup,
  sendGroupMessage,
  getGroupMessages,
  removeMember,
  deleteGroup,
};
