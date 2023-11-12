const { boolean } = require("joi");
const mongoose = require("mongoose");

const RecommendedSchema = mongoose.Schema({
  indestr_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

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
  registered: {
    type: Boolean,
    required: true,
    default: false,
  },
  recommended: {
    type: [RecommendedSchema],
    validate: {
      validator: function (v) {
        // Adjust the limit as per your needs
        return v.length <= 15; // Set the maximum size of the array
      },
      message: (props) => `${props.value} exceeds the limit of 5 items!`,
    },
  },
  resentViewed: [
    {
      company_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
      },
      watched_time: {
        type: Date,
      },
    },
  ],
});

let User = mongoose.model("user", usermodel);
module.exports = User;
