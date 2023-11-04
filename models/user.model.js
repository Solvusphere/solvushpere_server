const mongoose = require("mongoose");

const usermodel = new mongoose.Schema({
  username: {
    type: String,
    requried: true,
  },
  email: {
    type: String,
    requried: true,
    index: true,
  },
  number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
});

let User = mongoose.model("user", usermodel);
module.exports = User;