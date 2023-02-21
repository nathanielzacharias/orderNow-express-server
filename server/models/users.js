const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    trim: true,
    required: 'Username is required',
    unique: 'Username already exists',
  },

  email: {
    type: String,
    trim: true,
    required: 'Email is required' ,
    unique: 'Email already exists',
    match: [ /.+\@.+\..+/ , 'Email must be valid']
  },

  created: {
    type: Date,
    default: Date.now
  },

  updated: Date,

  password: {
    type: String,
    required: 'Password is required',
  },

});



const User = mongoose.model("User", userSchema);
module.exports = User;
