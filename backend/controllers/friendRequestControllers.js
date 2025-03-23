const User = require("../Models/userModels");

const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (senderId == receiverId) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //check if request already exists
    const existingRequest = receiver.friendRequests.find(
      (req) => req.sender.toString() === senderId
    );

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    //Add friend request to receiver
    receiver.friendRequests.push({ sender: senderId });
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    console.log("Received request body", req.body);
    const { userId, requestId } = req.body;
    console.log("Received userId", userId);
    console.log("Received requestId", requestId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find request
    const requestIndex = user.friendRequests.findIndex(
      (req) => req._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const senderId = user.friendRequests[requestIndex].sender;

    //add each other as friends
    user.friends.push(senderId);
    const sender = await User.findById(senderId);
    sender.friends.push(userId);

    // Remove request
    user.friendRequests.splice(requestIndex, 1);
    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find request
    user.friendRequests = user.friendRequests.filter(
      (req) => req._id.toString() !== requestId
    );

    await user.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "friendRequests.sender",
      "username profilePic"
    );

    res.status(200).json(user.friendRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getFriendsList = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "friends",
      "username profilePic"
    );

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriendsList,
};
