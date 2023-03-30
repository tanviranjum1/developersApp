// // for mongo db connection.
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// // this will give us back a promise.
// // can use .then or .catch
// // we will use async await instead.
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

// // export connectDB function.
module.exports = connectDB;
