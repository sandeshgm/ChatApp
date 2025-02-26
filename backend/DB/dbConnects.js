const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log("Database connect successfully!!!");
  } catch (error) {
    console.log(console.error);
  }
};

module.exports = dbConnect;
