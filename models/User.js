const mongoose = require('mongoose');

// create schema.
const userSchema = new mongoose.Schema({
  //takes object will fields
  name: {
    type: String,
    required: true,
  },
  // wil have them logging in with email and pass.
  email: {
    type: String,
    required: true,
    // so we don't have two people registered with same email
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  //   avatar allows you to attach a profile to your image.
  // it's in usermodel so it's accessible. to be available right away.
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now, // current date and time.
  },
});

// takes in model name and  schema.
module.exports = User = mongoose.model('user', userSchema);
