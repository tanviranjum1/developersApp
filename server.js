// bring express
const express = require("express");
const mongoose = require("mongoose");
const db =
  "mongodb+srv://DeathStar:IiCMwVZqlfkbEQUS@cluster0.ttq28tg.mongodb.net/devConnector?retryWrites=true&w=majority";

// bring the mongodb connection.
// const connectDB = require("./config/db");

//initialize app variable with express.
const app = express();

// Connect Database. //after initilization to express. connect to db.

const connectDB = async () => {
  // try catch if it fails get erro message.
  try {
    // this returns a promise so await.
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Init Middleware.
// now bodyparser is included with express
//init middleware. this will allow to get date in the request body.
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes. // to accesss the routes.
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// look at environment variables called port.
// when we deploy to heroku that's where it will get port number.
// if not deployed to heroku then locally default it to port number 5000.
const PORT = 5000;

// use app variable to listen on a port.
app.listen(PORT, () => {
  //calllback if you want sth to happen after it connects.
  console.log(`Server started on port ${PORT}`);
});
