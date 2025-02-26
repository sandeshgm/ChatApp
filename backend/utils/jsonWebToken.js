const jwt = require("jsonwebtoken");

const jwtToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30 days",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 10);
  res.cookie("jwt", token),
    {
      httpOnly: true,
      expire: expiresAt,
      sameSite:"strict",
      secure:process.env.SECURE !== "development"
    };
};

module.exports = jwtToken;
