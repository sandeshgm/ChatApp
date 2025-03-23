require("dotenv").config();
const express = require("express");
const dbConnect = require("./DB/dbConnects");
const authRouter = require("./routes/authUser");
const friendRoutes = require("./routes/friendRequestRoutes");
const groupRoutes = require("./routes/groupRoutes");
const messageRoutes = require("./routes/messageRoute");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

//database connections
dbConnect();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/friends", friendRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} `);
});
