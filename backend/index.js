const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const dbConnect = require("./DB/dbConnects");

const app = express();
app.use(express.json());

const authRouter = require("./routes/authUser");

dbConnect();

app.use('/api/auth',authRouter);

app.get("/", (req, res) => {
    res.send("Server is working");
  });

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} `);
});
