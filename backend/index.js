require("dotenv").config();
const express = require("express");
const dbConnect = require("./DB/dbConnects");
const authRouter = require("./routes/authUser");


const app = express();
const PORT = process.env.PORT || 3001;

//database connections
dbConnect();


//middleware 
app.use(express.json());


//routes 
app.use('/api/auth',authRouter);

app.get("/", (req, res) => {
    res.send("Server is working");
  });

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} `);
});
