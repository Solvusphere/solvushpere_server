const mongoose = require("mongoose");

const usermodel = new mongoose.Schema({
  username: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    requried: true,
    unique: true,
    index: true,
  },
  number: {
    type: Number,
  },
  password: {
    type: String,
  },
});

let User = mongoose.model("user", usermodel);
module.exports = User;
