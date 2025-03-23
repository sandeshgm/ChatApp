const User = require("../Models/userModels");
const bcrypt = require("bcryptjs");
const jwtToken = require("../utils/jsonWebToken");

const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, password, profilePic, gender } =
      req.body;

    //Checking user already exists or not
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    //Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //set default profile Pucture
    const defaultProfilePic =
      profilePic ||
      (gender === "male"
        ? "https://cdn-icons-png.flaticon.com/512/219/219970.png"
        : "https://cdn-icons-png.flaticon.com/512/219/219969.png");

    // const profileBoy =
    //   profilePic ||
    //   `https://www.flaticon.com/free-icon/user_219970?term=avatar&page=1&position=60&origin=tag&related_id=219970${username}`;
    // const profileGirl =
    //   profilePic ||
    //   `https://www.flaticon.com/free-icon/user_219970?term=avatar&page=1&position=60&origin=tag&related_id=219970${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilePic: defaultProfilePic,
    });

    await newUser.save();

    jwtToken(newUser._id, res);

    // if (newUser) {
    //   await newUser.save();
    //   jwtToken(newUser._id, res);
    // } else {
    //   res.status(400).json({
    //     message: "invalid user data",
    //   });
    // }

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      profilePic: newUser.profilePic,
      email: newUser.email,
      message: "User register successfull!",
    });
  } catch (error) {
    console.log("Registration error", error);
    res.status(500).json({
      success: false,
      message: "Filled all data field ",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "User not found. Please register first",
      });
      return;
    }


    //compare password
    const comparePassword = bcrypt.compareSync(password, user.password || "");
    if (!comparePassword) {
      return res.status(400).json({
        message: "Email or Password doesnot match",
      });
    }
    jwtToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      profilePic: user.profilePic,
      email: user.email,
      message: "User login successfull!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const userLogOut = async (req, res) => {
  try {
    res.clearCookie("jwt"),
      res.status(200).json({
        message: "User logout successfully",
      });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } }, // Case-insensitive match
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("fullname username profilePic");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { userRegister, userLogin, userLogOut,getUserDetails, searchUsers };
