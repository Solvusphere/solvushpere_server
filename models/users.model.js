const { boolean } = require("joi");
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
<<<<<<< HEAD
  verified: {
    type: Boolean,
    required:true
  }
=======
  registered: {
    type: Boolean,
    required: true,
    default: false,
  },
  recommented: [
    {
      indestr_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
      },
      count: {
        type: Number,
      },
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
        requried: true,
      },
    },
  ],
>>>>>>> user-solution
});

let User = mongoose.model("user", usermodel);
module.exports = User;
